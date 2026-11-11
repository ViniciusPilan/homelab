"""Extract stock indicators from Investidor10 company pages.

Usage:
    python3 investidor10.py [TICKER]

The default ticker is BBDC4. Values are returned as displayed by the site.
"""

from html.parser import HTMLParser
import json
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = "https://investidor10.com.br/acoes/{ticker}/"
REQUEST_TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (compatible; InvestmentReport/1.0)"


class Element:
    """Small HTML node used to find values without external parser packages."""

    def __init__(self, tag, attributes):
        self.tag = tag
        self.attributes = dict(attributes)
        self.children = []

    def text(self):
        return " ".join(
            part for part in (child.text() if isinstance(child, Element) else child for child in self.children)
            if part
        ).strip()

    def has_class(self, class_name):
        return class_name in self.attributes.get("class", "").split()

    def find_all(self, tag=None, class_name=None):
        found = []
        for child in self.children:
            if not isinstance(child, Element):
                continue
            if (tag is None or child.tag == tag) and (
                class_name is None or child.has_class(class_name)
            ):
                found.append(child)
            found.extend(child.find_all(tag, class_name))
        return found


class PageParser(HTMLParser):
    """Build a minimal tree sufficient to locate the site's indicator cards."""

    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element("document", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)
        if tag not in self.VOID_TAGS:
            self.stack.append(element)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Element(tag, attrs))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        text = data.strip()
        if text:
            self.stack[-1].children.append(text)


def _first_text(root, tag=None, class_name=None):
    elements = root.find_all(tag=tag, class_name=class_name)
    return elements[0].text() if elements else None


def _card_value(root, card_class, value_class=None):
    cards = [element for element in root.find_all("div", "_card") if element.has_class(card_class)]
    if not cards:
        return None
    if value_class:
        return _first_text(cards[0], class_name=value_class)
    bodies = cards[0].find_all("div", "_card-body")
    if not bodies:
        return None
    spans = bodies[0].find_all("span")
    return spans[0].text() if spans else None


def _indicator_value(root, indicator_name):
    for card in root.find_all("article", "indicator-card"):
        title = _first_text(card, class_name="indicator-card-title")
        if title and title.strip() == indicator_name:
            value = _first_text(card, class_name="indicator-card-value")
            if value:
                return value

            # The indicator's history button also carries the current value,
            # which is a useful fallback if the visible value markup changes.
            for button in card.find_all("button", "indicator-history-graph"):
                if button.attributes.get("data-indicator") == indicator_name:
                    return button.attributes.get("data-current-value")
    return None


def _liquidity_value(root):
    for cell in root.find_all("div", "cell"):
        if _first_text(cell, "span", "title") == "Liquidez Média Diária":
            value = _first_text(cell, "div", "detail-value")
            return value or _first_text(cell, "div", "simple-value")
    return None


def _company_data_value(root, field_name):
    """Read a labeled company detail such as its business segment."""
    for cell in root.find_all("div", "cell"):
        if _first_text(cell, "span", "title") == field_name:
            return _first_text(cell, "span", "value")
    return None


def parse_stock_html(html):
    """Return the requested metrics from an Investidor10 HTML page."""
    parser = PageParser()
    parser.feed(html)
    page = parser.root

    price = _card_value(page, "cotacao", "value")
    if price is None:
        # The site currently uses the `cotacao` card; retain support for its
        # previous `price` class as a simple fallback.
        price = _card_value(page, "price", "value")

    variation = _card_value(page, "pl")
    if variation is None:
        # Avoid confusing the 12-month card with valuation cards by reading
        # the card whose header explicitly labels the period.
        for card in page.find_all("div", "_card"):
            header = _first_text(card, "span")
            if header and "VARIAÇÃO (12M)" in header.upper():
                body = card.find_all("div", "_card-body")
                spans = body[0].find_all("span") if body else []
                variation = spans[0].text() if spans else None
                break

    return {
        "preco": price,
        "variacao_12_meses": variation,
        "pl": _card_value(page, "val"),
        "p_vp": _card_value(page, "vp"),
        "dy_12_meses": _card_value(page, "dy"),
        "roe": _indicator_value(page, "ROE"),
        "roa": _indicator_value(page, "ROA"),
        "payout": _indicator_value(page, "Payout"),
        "margem_liquida": _indicator_value(page, "Margem Líquida"),
        "liquidez_diaria": _liquidity_value(page),
        "segmento": _company_data_value(page, "Segmento"),
    }


def fetch_stock_data(ticker="BBDC4"):
    """Fetch a ticker page and return its parsed indicators."""
    normalized_ticker = ticker.strip().upper()
    if not re.fullmatch(r"[A-Z0-9]{4,7}", normalized_ticker):
        raise ValueError("Ticker inválido. Use letras e números, por exemplo BBDC4.")

    url = BASE_URL.format(ticker=normalized_ticker.lower())
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            html = response.read().decode("utf-8", errors="replace")
    except HTTPError as error:
        raise RuntimeError(f"Investidor10 respondeu HTTP {error.code} para {normalized_ticker}.") from error
    except URLError as error:
        raise RuntimeError(f"Não foi possível acessar a página de {normalized_ticker}: {error.reason}") from error

    metrics = parse_stock_html(html)
    missing = [name for name, value in metrics.items() if value is None]
    if missing:
        raise RuntimeError(
            "Não foi possível localizar estes campos no HTML: " + ", ".join(missing)
        )
    return {"ticker": normalized_ticker, **metrics}


def main():
    ticker = sys.argv[1] if len(sys.argv) > 1 else "BBDC4"
    try:
        print(json.dumps(fetch_stock_data(ticker), ensure_ascii=False, indent=2))
    except (ValueError, RuntimeError) as error:
        print(f"Erro: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
