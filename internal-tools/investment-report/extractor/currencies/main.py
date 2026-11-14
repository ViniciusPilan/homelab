"""Collect current currency quotes and seven-day history in one JSON file."""

import json
import sys
from datetime import datetime
from pathlib import Path

from scraper.investidor10 import fetch_currencies


RESULTS_DIRECTORY = Path(__file__).parent / "results"


def main():
    try:
        currencies = fetch_currencies()
    except (RuntimeError, KeyboardInterrupt) as error:
        if isinstance(error, KeyboardInterrupt):
            print("Coleta interrompida.", file=sys.stderr)
            return 130
        print(f"Erro: {error}", file=sys.stderr)
        return 1

    RESULTS_DIRECTORY.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().astimezone().strftime("%d-%m-%Y_%H-%M-%S")
    output = json.dumps(currencies, ensure_ascii=False, indent=2) + "\n"
    dated_file = RESULTS_DIRECTORY / f"{timestamp}.json"
    latest_file = RESULTS_DIRECTORY / "latest.json"
    dated_file.write_text(output, encoding="utf-8")
    latest_file.write_text(output, encoding="utf-8")
    print(output, end="")
    print(f"\nArquivos salvos em:\n- {dated_file}\n- {latest_file}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
