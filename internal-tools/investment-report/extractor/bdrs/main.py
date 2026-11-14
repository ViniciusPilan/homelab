"""Collect indicators for configured BDRs and print them as JSON.

Run from any directory with:
    python3 internal-tools/investment-report/extractor/bdrs/main.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

from scraper.investidor10 import fetch_bdr_data


BDR_SYMBOLS = [
    {"name": "Apple", "ticker": "AAPL34"},
    {"name": "Alibaba", "ticker": "BABA34"},
    {"name": "Sea Limited", "ticker": "S1PO34"},
    {"name": "NVIDIA", "ticker": "NVDC34"},
    {"name": "Coca-Cola", "ticker": "COCA34"},
    {"name": "Walmart", "ticker": "WALM34"},
    {"name": "JPMorgan Chase", "ticker": "JPMC34"},
    {"name": "Microsoft", "ticker": "MSFT34"},
    {"name": "Alphabet", "ticker": "GOGL34"},
    {"name": "Amazon", "ticker": "AMZO34"},
    {"name": "Taiwan Semiconductor", "ticker": "TSMC34"},
    {"name": "Meta", "ticker": "M1TA34"},
    {"name": "Broadcom", "ticker": "AVGO34"},
    {"name": "Visa", "ticker": "VISA34"},
    {"name": "Tesla", "ticker": "TSLA34"},
]
RESULTS_DIRECTORY = Path(__file__).parent / "results"


def collect_bdrs():
    """Fetch indicators for every configured BDR, retaining individual errors."""
    bdrs = []
    for bdr in BDR_SYMBOLS:
        result = {"name": bdr["name"], "ticker": bdr["ticker"]}
        try:
            result["indicators"] = fetch_bdr_data(bdr["ticker"])
        except (RuntimeError, ValueError) as error:
            result["error"] = str(error)
        bdrs.append(result)
    return {"bdrs": bdrs}


def main():
    try:
        result = collect_bdrs()
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
