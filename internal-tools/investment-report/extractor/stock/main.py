"""Collect indicators for the configured stocks and print them as JSON.

Run from any directory with:
    python3 internal-tools/investment-report/extractor/stock/main.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

from scraper.investidor10 import fetch_stock_data


STOCK_SYMBOLS = [
    {"name": "Itaú", "ticker": "ITUB4"},
    {"name": "BTG", "ticker": "BPAC11"},
    {"name": "Bradesco", "ticker": "BBDC4"},
    {"name": "Banco do Brasil", "ticker": "BBAS3"},
    {"name": "Copasa", "ticker": "CSMG3"},
    {"name": "Sanepar", "ticker": "SAPR11"},
    {"name": "Sabesp", "ticker": "SBSP3"},
    {"name": "Alupar", "ticker": "ALUP4"},
    {"name": "CPFL Energia", "ticker": "CPFE3"},
    {"name": "Taesa", "ticker": "TAEE11"},
    {"name": "Petrobras", "ticker": "PETR4"},
    {"name": "Suzano", "ticker": "SUZB3"},
    {"name": "Vale", "ticker": "VALE3"},
    {"name": "WEG", "ticker": "WEGE3"},
]
RESULTS_DIRECTORY = Path(__file__).parent / "results"


def collect_stocks():
    """Fetch indicators for every configured stock, retaining individual errors."""
    stocks = []
    for stock in STOCK_SYMBOLS:
        result = {"name": stock["name"], "ticker": stock["ticker"]}
        try:
            result["indicators"] = fetch_stock_data(stock["ticker"])
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
