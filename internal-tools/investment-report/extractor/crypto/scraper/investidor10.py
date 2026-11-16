"""Collect current USD quotes and 30-day histories for selected cryptoassets."""

from datetime import datetime, timedelta
from html.parser import HTMLParser
import json
import re
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = "https://investidor10.com.br"
PAGE_URL = BASE_URL + "/criptomoedas/{slug}/"
CHART_URL = BASE_URL + "/api/criptomoedas/cotacoes/{crypto_id}/30/dollar"
REQUEST_TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (compatible; InvestmentReport/1.0)"
CRYPTOASSETS = [
    {"name": "Bitcoin", "slug": "bitcoin", "crypto_id": 1},
    {"name": "Ethereum", "slug": "ethereum", "crypto_id": 2},
    {"name": "XRP", "slug": "xrp", "crypto_id": 5},
    {"name": "Solana", "slug": "solana", "crypto_id": 45},
]


class Element:
    """Small HTML node for locating quote cards without third-party packages."""

    def __init__(self, tag, attributes):
        self.tag = tag
        self.attributes = dict(attributes)
        self.children = []

    def text(self):
        return " ".join(
            part
            for part in (
                child.text() if isinstance(child, Element) else child
                for child in self.children
            )
            if part
        ).strip()

    def find_all(self, tag=None, class_name=None):
        found = []
        for child in self.children:
            if not isinstance(child, Element):
                continue
            if (tag is None or child.tag == tag) and (
                class_name is None
                or class_name in child.attributes.get("class", "").split()
            ):
                found.append(child)
            found.extend(child.find_all(tag, class_name))
        return found


class CryptoPageParser(HTMLParser):
    """Build a small HTML tree and capture the current USD quote."""

    VOID_TAGS = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element("document", [])
        self.stack = [self.root]
        self.current_price = None

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "input" and attributes.get("name") == "dollarQuotation":
            self.current_price = attributes.get("value")
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)
        if tag not in self.VOID_TAGS:
            self.stack.append(element)

    def handle_startendtag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "input" and attributes.get("name") == "dollarQuotation":
            self.current_price = attributes.get("value")
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


def _request(url, accept="text/html"):
    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": accept,
            "Referer": BASE_URL + "/criptomoedas/bitcoin/",
        },
    )
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            return response.read().decode("utf-8", errors="replace")
    except HTTPError as error:
        raise RuntimeError(f"Investidor10 respondeu HTTP {error.code} em {url}.") from error
    except URLError as error:
        raise RuntimeError(f"Não foi possível acessar {url}: {error.reason}") from error


def _variation(page, period, crypto_name):
    expected_title = f"VARIAÇÃO ({period})"
    for card in page.find_all("div", "_card"):
        titles = [
            element
            for element in card.find_all("span")
            if element.attributes.get("title", "").strip().upper() == expected_title
        ]
        if not titles:
            continue
        for span in card.find_all("span"):
            value = span.text().strip()
            if re.fullmatch(r"[-+]?\d+(?:[.,]\d+)?%", value):
                return value
    raise RuntimeError(f"Variação {period} não encontrada na página de {crypto_name}.")


def _variation_30d(values):
    """Return the signed percentage change between the first and last prices."""
    if not values or values[0] == 0:
        raise RuntimeError("Não foi possível calcular a variação de 30 dias.")
    percentage = (values[-1] - values[0]) / values[0] * 100
    return f"{percentage:+.2f}%"


def fetch_crypto(crypto):
    """Return 30 chronological calendar-day USD values and page variations."""
    html = _request(PAGE_URL.format(slug=crypto["slug"]))
    parser = CryptoPageParser()
    parser.feed(html)
    if parser.current_price is None:
        raise RuntimeError(f"Cotação atual em dólares não encontrada para {crypto['name']}.")
    try:
        current_price = float(parser.current_price)
    except ValueError as error:
        raise RuntimeError(f"Cotação inválida para {crypto['name']}.") from error

    variation_24h = _variation(parser.root, "24H", crypto["name"])
    variation_12m = _variation(parser.root, "12M", crypto["name"])

    chart_url = CHART_URL.format(crypto_id=crypto["crypto_id"])
    try:
        history = json.loads(_request(chart_url, "application/json"))
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Histórico inválido recebido para {crypto['name']}.") from error
    if not isinstance(history, list) or not history:
        raise RuntimeError(f"O Investidor10 não retornou histórico para {crypto['name']}.")

    quotes_by_date = {}
    for point in history:
        try:
            quote_date = datetime.strptime(point["created_at"], "%d/%m/%Y").date()
            quotes_by_date[quote_date] = float(point["dolar_price"])
        except (KeyError, TypeError, ValueError) as error:
            raise RuntimeError(f"Ponto inválido no histórico de {crypto['name']}.") from error

    today = datetime.now().astimezone().date()
    first_day = today - timedelta(days=29)
    available_quotes = sorted(quotes_by_date.items())
    if not available_quotes:
        raise RuntimeError(f"O histórico de {crypto['name']} não contém cotações válidas.")

    previous_quote = next(
        (price for quote_date, price in reversed(available_quotes) if quote_date < first_day),
        available_quotes[0][1],
    )
    values = []
    for day_offset in range(30):
        quote_date = first_day + timedelta(days=day_offset)
        if quote_date in quotes_by_date:
            previous_quote = quotes_by_date[quote_date]
        values.append(previous_quote)
    values[-1] = current_price

    return {
        "name": crypto["name"],
        "values": values,
        "variation_30d": _variation_30d(values),
        "variation_24h": variation_24h,
        "variation_12m": variation_12m,
    }


def fetch_cryptos():
    """Fetch every configured cryptoasset, failing clearly on source changes."""
    return [fetch_crypto(crypto) for crypto in CRYPTOASSETS]
