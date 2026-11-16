"""Collect indicators for the configured FIIs and print them as JSON.

Run from any directory with:
    python3 internal-tools/investment-report/extractor/fiis/main.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

from scraper.investidor10 import fetch_fii_data


STOCK_SYMBOLS = [
    {"name": "APTO11", "ticker": "APTO11"},
    {"name": "BTAL11", "ticker": "BTAL11"},
    {"name": "BTLG11", "ticker": "BTLG11"},
    {"name": "GARE11", "ticker": "GARE11"},
    {"name": "KNCR11", "ticker": "KNCR11"},
    {"name": "KNRI11", "ticker": "KNRI11"},
    {"name": "VISC11", "ticker": "VISC11"},
    {"name": "XPLG11", "ticker": "XPLG11"},
    {"name": "XPML11", "ticker": "XPML11"},
]
RESULTS_DIRECTORY = Path(__file__).parent / "results"


def collect_stocks():
    """Fetch indicators for every configured stock, retaining individual errors."""
    stocks = []
    for stock in STOCK_SYMBOLS:
        result = {"name": stock["name"], "ticker": stock["ticker"]}
        try:
            result["indicators"] = fetch_fii_data(stock["ticker"])
        except (RuntimeError, ValueError) as error:
            result["error"] = str(error)
        stocks.append(result)
    return {"stocks": stocks}


def main():
    try:
        result = collect_stocks()
    except KeyboardInterrupt:
        print("Coleta interrompida.", file=sys.stderr)
        return 130

    RESULTS_DIRECTORY.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().astimezone().strftime("%d-%m-%Y_%H-%M-%S")
    result_file = RESULTS_DIRECTORY / f"{timestamp}.json"
    latest_file = RESULTS_DIRECTORY / "latest.json"
    result_json = json.dumps(result, ensure_ascii=False, indent=2)
    result_file.write_text(result_json + "\n", encoding="utf-8")
    latest_file.write_text(result_json + "\n", encoding="utf-8")

    print(result_json)
    print(
        f"\nArquivos salvos em:\n- {result_file}\n- {latest_file}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
