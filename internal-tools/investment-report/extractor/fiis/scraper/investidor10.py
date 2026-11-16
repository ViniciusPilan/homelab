"""Extract indicators from Investidor10 FII pages.

Current page mappings were checked against https://investidor10.com.br/fiis/xpml11/:
- price, DY, P/VP, liquidity, and 12-month variation: ``#cards-ticker ._card``
- total equity and equity per share: ``.cell`` records in the fund information
  section, identified by their ``.name`` label and ``.value`` content.

Usage:
    python3 investidor10.py [TICKER]

Values are returned as displayed by Investidor10 (including currency and units).
"""

from html.parser import HTMLParser
import json
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = "https://investidor10.com.br/fiis/{ticker}/"
REQUEST_TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (compatible; InvestmentReport/1.0)"


class Element:
    """Minimal HTML node used to locate values without third-party packages."""

    def __init__(self, tag, attributes):
        self.tag = tag
        self.attributes = dict(attributes)
        self.children = []

    def text(self):
        parts = (
            child.text() if isinstance(child, Element) else child
            for child in self.children
        )
        return " ".join(part for part in parts if part).strip()

    def has_class(self, class_name):
        return class_name in self.attributes.get("class", "").split()

    def find_all(self, tag=None, class_name=None, element_id=None):
        found = []
        for child in self.children:
            if not isinstance(child, Element):
                continue
            if (
                (tag is None or child.tag == tag)
                and (class_name is None or child.has_class(class_name))
                and (element_id is None or child.attributes.get("id") == element_id)
            ):
                found.append(child)
            found.extend(child.find_all(tag, class_name, element_id))
        return found


class PageParser(HTMLParser):
    """Build a small tree for the parts of the page containing the metrics."""

    VOID_TAGS = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

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
        text = " ".join(data.split())
        if text:
            self.stack[-1].children.append(text)


def _first_text(root, tag=None, class_name=None):
    elements = root.find_all(tag=tag, class_name=class_name)
    return elements[0].text() if elements else None


def _card_value(cards, card_class, value_class=None):
    for card in cards.find_all("div", "_card"):
        if not card.has_class(card_class):
            continue
        if value_class:
            return _first_text(card, class_name=value_class)
        bodies = card.find_all("div", "_card-body")
        if bodies:
            spans = bodies[0].find_all("span")
            if spans:
                return spans[0].text()
    return None


def _summary_card_value(cards, label):
    for card in cards.find_all("div", "_card"):
        headers = card.find_all("span")
        if not headers or label.casefold() not in headers[0].text().casefold():
            continue
        bodies = card.find_all("div", "_card-body")
        if not bodies:
            return None
        for span in bodies[0].find_all("span"):
            value = span.text()
            if value:
                return value
    return None


def _fund_info_value(page, label):
    for cell in page.find_all("div", "cell"):
        name = _first_text(cell, "span", "name")
        if name and name.strip().casefold() == label.casefold():
            return _first_text(cell, "div", "value")
    return None


def parse_fii_html(html, ticker="XPML11"):
    """Parse the requested fund fields from an Investidor10 page response."""
    parser = PageParser()
    parser.feed(html)
    page = parser.root

    fund_name = _first_text(page, "h2", "name-company")
    cards_list = page.find_all("section", element_id="cards-ticker")
    cards = cards_list[0] if cards_list else page

    return {
        "fundo": fund_name or ticker.upper(),
        "preco": _card_value(cards, "cotacao", "value"),
        "patrimonio_total": _fund_info_value(page, "VALOR PATRIMONIAL"),
        "vp_cota": _fund_info_value(page, "VAL. PATRIMONIAL P/ COTA"),
        "variacao_12_meses": _summary_card_value(cards, "VARIAÇÃO (12M)"),
        "p_vp": _card_value(cards, "vp"),
        "dy_12_meses": _summary_card_value(cards, "DY (12M)"),
        "liquidez_diaria": _summary_card_value(cards, "Liquidez Diária"),
        "segmento": _fund_info_value(page, "SEGMENTO"),
        "tipo_de_fundo": _fund_info_value(page, "TIPO DE FUNDO"),
        "vacancia": _fund_info_value(page, "VACÂNCIA"),
        "ultimo_rendimento": _fund_info_value(page, "ÚLTIMO RENDIMENTO"),
        "taxa_administracao": _fund_info_value(page, "TAXA DE ADMINISTRAÇÃO"),
    }


def fetch_fii_data(ticker="XPML11"):
    """Fetch one FII page and return its requested indicators."""
    normalized_ticker = ticker.strip().upper()
    if not re.fullmatch(r"[A-Z0-9]{4,7}", normalized_ticker):
        raise ValueError("Ticker inválido. Use letras e números, por exemplo XPML11.")

    url = BASE_URL.format(ticker=normalized_ticker.lower())
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            html = response.read().decode("utf-8", errors="replace")
    except HTTPError as error:
        raise RuntimeError(
            f"Investidor10 respondeu HTTP {error.code} para {normalized_ticker}."
        ) from error
    except URLError as error:
        raise RuntimeError(
            f"Não foi possível acessar a página de {normalized_ticker}: {error.reason}"
        ) from error

    metrics = parse_fii_html(html, normalized_ticker)
    missing = [name for name, value in metrics.items() if value is None]
    if missing:
        raise RuntimeError(
            "Não foi possível localizar estes campos no HTML: " + ", ".join(missing)
        )
    return {"ticker": normalized_ticker, **metrics}


def main():
    ticker = sys.argv[1] if len(sys.argv) > 1 else "XPML11"
    try:
        print(json.dumps(fetch_fii_data(ticker), ensure_ascii=False, indent=2))
    except (ValueError, RuntimeError) as error:
        print(f"Erro: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
