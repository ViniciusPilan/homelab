"""Collect current commodity metrics from Investing.com pages."""

from datetime import datetime, timedelta
from html.parser import HTMLParser
import re
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = "https://br.investing.com"
REQUEST_TIMEOUT = 25
USER_AGENT = "Mozilla/5.0 (compatible; InvestmentReport/1.0)"
COMMODITIES = [
    {"name": "Ouro", "slug": "gold", "unit": "USD por onça troy"},
    {"name": "Prata", "slug": "silver", "unit": "USD por onça troy"},
    {"name": "Petróleo Brent", "slug": "brent-oil", "unit": "USD por barril"},
    {"name": "Soja", "slug": "us-soybeans", "unit": "USD por contrato (5.000 bushels)"},
    {"name": "Café Contrato C", "slug": "us-coffee-c", "unit": "USD por libra"},
    {"name": "Arroz em casca", "slug": "rough-rice", "unit": "USD por quintal (cwt)"},
    {
        "name": "Minério de ferro 62% CFR",
        "slug": "iron-ore-62-cfr-futures",
        "unit": "USD por tonelada métrica seca",
    },
]


class TextParser(HTMLParser):
    """Extract readable page text without adding a third-party dependency."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.ignored_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript", "svg"}:
            self.ignored_depth += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript", "svg"} and self.ignored_depth:
            self.ignored_depth -= 1

    def handle_data(self, data):
        if not self.ignored_depth:
            value = " ".join(data.split())
            if value:
                self.parts.append(value)


class HistoricalTableParser(HTMLParser):
    """Collect table rows from the historical prices page."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.row = None
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row = []
        elif tag in {"td", "th"} and self.row is not None:
            self.cell = []

    def handle_endtag(self, tag):
        if tag in {"td", "th"} and self.row is not None and self.cell is not None:
            self.row.append(" ".join(" ".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            self.rows.append(self.row)
            self.row = None

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data.strip())


def _request(url):
    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.7",
            "Referer": BASE_URL + "/commodities/",
        },
    )
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            return response.read().decode("utf-8", errors="replace")
    except HTTPError as error:
        raise RuntimeError(f"Investing.com respondeu HTTP {error.code} em {url}.") from error
    except URLError as error:
        raise RuntimeError(f"Não foi possível acessar {url}: {error.reason}") from error


def _number(value, integer=False):
    """Parse Investing's localized numeric strings into numbers."""
    value = value.replace("−", "-").replace("–", "-")
    cleaned = re.sub(r"[^0-9,.-]", "", value.strip())
    if not cleaned:
        raise ValueError("valor numérico vazio")
    if integer:
        cleaned = cleaned.replace(".", "").replace(",", "")
        return int(cleaned)
    if "," in cleaned and "." in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")
    elif "," in cleaned:
        cleaned = cleaned.replace(",", ".")
    return float(cleaned) if "." in cleaned else int(cleaned)


def _label_value(text, pattern):
    return re.search(pattern, text, re.IGNORECASE)


def _parse_number(value, integer=False):
    if value is None:
        return "-"
    try:
        return _number(value, integer=integer)
    except ValueError:
        return "-"


def _history(commodity):
    """Return available daily closing prices from the latest 30 calendar days."""
    url = f"{BASE_URL}/commodities/{commodity['slug']}-historical-data"
    parser = HistoricalTableParser()
    parser.feed(_request(url))

    header_index = next(
        (
            index
            for index, row in enumerate(parser.rows)
            if len(row) >= 2
            and "data" in row[0].strip().lower()
            and "último" in row[1].strip().lower()
        ),
        None,
    )
    if header_index is None:
        return "-"

    first_date = datetime.now().astimezone().date() - timedelta(days=29)
    values = []
    for row in parser.rows[header_index + 1 :]:
        if len(row) < 2:
            continue
        try:
            quote_date = datetime.strptime(row[0].strip(), "%d.%m.%Y").date()
            close = _number(row[1])
        except ValueError:
            continue
        if first_date <= quote_date <= datetime.now().astimezone().date():
            values.append({"date": quote_date.isoformat(), "close": close})

    values.sort(key=lambda point: point["date"])
    return values or "-"


def fetch_commodity(commodity):
    """Read price, trading ranges, volume and one-year change from one page."""
    url = f"{BASE_URL}/commodities/{commodity['slug']}"
    parser = TextParser()
    parser.feed(_request(url))
    text = " ".join(parser.parts)
    name = commodity["name"]

    # The current quote follows the page's USD denomination and portfolio action.
    price_match = _label_value(
        text, r"Moeda em USD\s+Adicionar à carteira\s+([\d.,]+)"
    )
    yearly_range_match = _label_value(
        text, r"Var\. 52 semanas\s+([\d.,]+)\s+([\d.,]+)"
    )
    volume_match = re.search(r"Volume\s+([\d.,]+)", text, re.IGNORECASE)
    yearly_change_match = _label_value(
        text,
        r"Variação\s+em\s+1\s+ano\s*[:：]?\s*([-+−–]?\s*\d[\d.,]*\s*%)",
    )

    price = _parse_number(price_match.group(1) if price_match else None)
    range_52w = "-"
    if yearly_range_match:
        low, high = (_parse_number(value) for value in yearly_range_match.groups())
        if low != "-" and high != "-":
            range_52w = {"low": low, "high": high}
    volume = _parse_number(
        volume_match.group(1) if volume_match else None, integer=True
    )
    yearly_change = _parse_number(
        re.sub(r"\s+", "", yearly_change_match.group(1)).rstrip("%")
        if yearly_change_match
        else None
    )
    try:
        history = _history(commodity)
    except RuntimeError:
        history = "-"

    return {
        "name": name,
        "url": url,
        "price_usd": price,
        "range_52w": range_52w,
        "volume": volume,
        "variation_1y_pct": yearly_change,
        "history_30d": history,
        "unit": commodity["unit"],
    }


def fetch_commodities():
    """Fetch all configured commodities, failing clearly on source changes."""
    return [fetch_commodity(commodity) for commodity in COMMODITIES]
