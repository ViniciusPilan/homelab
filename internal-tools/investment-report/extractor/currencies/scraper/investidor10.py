"""Collect current BRL currency quotes and their 30-day history."""

from html.parser import HTMLParser
import json
import re
from datetime import datetime, timedelta
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = "https://investidor10.com.br"
PAGE_URL = BASE_URL + "/moedas/{slug}/"
CHART_URL = BASE_URL + "/api/moedas/chart/{coin_id}/30"
REQUEST_TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (compatible; InvestmentReport/1.0)"
CURRENCIES = [
    {"name": "Dólar", "slug": "usd", "coin_id": 3},
    {"name": "Euro", "slug": "eur", "coin_id": 2},
    {"name": "Libra esterlina", "slug": "gbp", "coin_id": 6},
    {"name": "Peso argentino", "slug": "ars", "coin_id": 14},
]


class QuoteParser(HTMLParser):
    """Read the quote and variation cards from a currency page."""

    TARGETS = {"brlprice": "price", "dayvariation": "variation_24h", "yearvariation": "variation_12m"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active_target = None
        self.active_tag = None
        self.values = {}

    def handle_starttag(self, tag, attrs):
        target = self.TARGETS.get(dict(attrs).get("id"))
        if target:
            self.active_target = target
            self.active_tag = tag
            self.values[target] = ""

    def handle_endtag(self, tag):
        if self.active_target and tag == self.active_tag:
            self.active_target = None
            self.active_tag = None

    def handle_data(self, data):
        if self.active_target:
            self.values[self.active_target] += data.strip()


def _request(url, accept="text/html"):
    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": accept,
            "Referer": BASE_URL + "/moedas/usd/",
        },
    )
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            return response.read().decode("utf-8", errors="replace")
    except HTTPError as error:
        raise RuntimeError(f"Investidor10 respondeu HTTP {error.code} em {url}.") from error
    except URLError as error:
        raise RuntimeError(f"Não foi possível acessar {url}: {error.reason}") from error


def _parse_brl(value):
    """Convert a Brazilian-formatted quote such as 'R$ 5,64' to a number."""
    match = re.search(r"([\d.]+,\d+)", value or "")
    if not match:
        raise RuntimeError(f"Não foi possível interpretar a cotação em reais: {value!r}")
    return float(match.group(1).replace(".", "").replace(",", "."))


def fetch_currency(currency):
    """Return chronological daily BRL values, ending at the current page quote."""
    page_url = PAGE_URL.format(slug=currency["slug"])
    html = _request(page_url)
    parser = QuoteParser()
    parser.feed(html)
    missing = [key for key in ("price", "variation_24h", "variation_12m") if not parser.values.get(key)]
    if missing:
        raise RuntimeError(
            f"Campos não encontrados na página de {currency['name']}: {', '.join(missing)}."
        )
    current_price = _parse_brl(parser.values["price"])

    chart_url = CHART_URL.format(coin_id=currency["coin_id"])
    try:
        history = json.loads(_request(chart_url, "application/json"))
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Histórico inválido recebido para {currency['name']}.") from error
    if not isinstance(history, list) or not history:
        raise RuntimeError(f"O Investidor10 não retornou histórico para {currency['name']}.")

    quotes_by_date = {}
    for point in history:
        try:
            quote_date = datetime.strptime(point["created_at"], "%d/%m/%Y").date()
            quotes_by_date[quote_date] = float(point["price"])
        except (KeyError, TypeError, ValueError) as error:
            raise RuntimeError(f"Ponto inválido no histórico de {currency['name']}.") from error

    # Build a calendar-day series: weekends and holidays carry the last known
    # quote forward so every currency has exactly 30 daily values.
    today = datetime.now().astimezone().date()
    first_day = today - timedelta(days=29)
    available_quotes = sorted(quotes_by_date.items())
    if not available_quotes:
        raise RuntimeError(f"O histórico de {currency['name']} não contém cotações válidas.")

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

    # Use the current page quote for today's point, even when today is not a
    # trading day and the source history ends on the previous business day.
    values[-1] = current_price
    return {
        "name": currency["name"],
        "values": values,
        "variation_24h": parser.values["variation_24h"],
        "variation_12m": parser.values["variation_12m"],
    }


def fetch_currencies():
    """Fetch all configured currencies, failing clearly if a source changes."""
    return [fetch_currency(currency) for currency in CURRENCIES]
