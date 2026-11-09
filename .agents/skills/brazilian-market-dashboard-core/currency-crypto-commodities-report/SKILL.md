---
name: currency-crypto-commodities-report
description: Create a concise, current HTML dashboard of selected foreign exchange rates, cryptoassets, and commodity prices, with changes over time.
metadata:
  short-description: Dashboard of currencies, crypto, and commodities
---

# Currency, crypto, and commodities dashboard

Use this subskill together with the shared research and HTML workflow in [the Brazilian market dashboard core](../SKILL.md). This skill defines the asset set, sources, price units, and comparison rules for this report. It is for price monitoring; keep commentary brief and avoid deep macroeconomic analysis.

## Required asset universe

Include the full set below unless the user narrows it:

### Foreign currencies, all quoted in Brazilian reais

- US dollar — USD, price in R$ per US$ 1.
- Euro — EUR, price in R$ per €1.
- Pound sterling — GBP, price in R$ per £1.
- Chinese yuan / renminbi — CNY, price in R$ per ¥1 (state clearly that this is the mainland renminbi, not Hong Kong dollar).
- Argentine peso — ARS, price in R$ per ARS 1. If a source displays a rate per 100 or 1,000 pesos, convert transparently to one peso and cite the conversion basis. Identify which Argentine exchange-rate regime is used (official/wholesale, retail, or another named rate); never blend parallel/blue and official rates.

### Cryptoassets, all quoted in US dollars

- Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and XRP.
- Correct spelling is Ethereum. State the exchange or pricing aggregator and quote currency. Do not treat wrapped tokens, futures, or a different token with a similar ticker as the spot asset.

### Commodities, all quoted in US dollars

- Gold — USD per troy ounce.
- Crude oil — USD per barrel. Use Brent as the default international benchmark; label WTI separately if that is the available or requested benchmark. Do not combine benchmarks.
- Iron ore — USD per dry metric tonne (dmt), for the source's stated grade and delivery basis. Prefer the benchmark for 62% Fe fines delivered to China when available; label grade, location, and futures/spot basis where the source provides them.

Do not add other assets by default. A missing item stays in the dashboard with `n/d` and a short source/coverage note after the allowed source order is exhausted.

## Sources and quote selection

Refresh all prices and changes for each report. Link each data provider beside the relevant panel or in the source list, and record the retrieval date/time in local time (America/Sao_Paulo) plus the provider's quote timestamp/time zone when shown. State whether the quote is live, delayed, or a latest available close. Do not imply simultaneous prices when markets have different trading hours.

Use asset-appropriate sources, in this order, and do not use the stock/FII platforms by default:

- **FX:** Banco Central do Brasil PTAX / currency quotation data first for comparable BRL reference rates. If PTAX lacks a currency, an unsuitable quote date, or the relevant ARS regime, use a reputable foreign-exchange data provider that identifies its rate type and timestamp. Keep Brazilian official reference rates distinct from retail conversion prices and parallel Argentine rates.
- **Crypto spot:** CoinGecko first, then CoinMarketCap, then a major exchange's spot market data (for example, Coinbase or Binance) if the prior providers have no usable current quote. Use the same quote currency and matching time window across all four assets where possible.
- **Gold and oil:** use a recognized exchange or benchmark source (such as LBMA/CME for gold, ICE for Brent, or NYMEX/CME for WTI); if its data are not openly accessible, use a market-data provider that identifies the benchmark, unit, timestamp, and spot/futures basis.
- **Iron ore:** use the stated benchmark's exchange or recognized price-reporting agency if accessible; otherwise use a market-data provider that identifies grade, delivery basis, unit, timestamp, and spot/futures basis.

For each asset and period, use the first permitted source with a current, clearly defined, usable observation. If a source is inaccessible, does not cover the instrument, or omits a required definition, move to the next permitted source and note material coverage limitations. Do not quote a search-result snippet as a source. Do not silently splice price from one provider with a return series from another. If another provider is needed for the return, disclose it and make its period and timestamp explicit. Never calculate a missing official rate from an unrelated rate without labeling the conversion and its inputs.

## Dashboard fields and calculations

- Main table fields: asset, symbol/benchmark, latest price, 24-hour change, 7-day change, 30-day change, 12-month change, quote date/time, and source. Use the most useful periods supported by a consistent source; mark unavailable periods `n/d` rather than mixing incompatible bases.
- For currencies, price is **R$ per one foreign-currency unit**. If the upstream source is inverted (foreign currency per R$), invert the quote and label this calculation. Currency returns are the percentage change in the BRL price per foreign-currency unit over the stated interval; positive means that one unit of foreign currency costs more reais.
- For cryptoassets and commodities, price is **US$** per the stated unit. Percentage changes refer to the USD price and stated window. Do not convert these prices to reais.
- Identify return basis (change from matching timestamp, prior daily close, or provider-defined period) and source. If only a close-to-close value is available, label it; do not call it intraday change.
- Use Brazilian Portuguese and number formatting. Keep precision appropriate to the instrument: enough digits for CNY/ARS and small unit prices, without suggesting false precision. Display `R$`, `US$`, and units explicitly in headings or cells.
- Show one compact panel for BRL currency rates, one for USD crypto prices, and one for USD commodities. Do not rank these different groups together. Within a group, ordering may follow the prescribed universe rather than imply a recommendation.
- Keep any explanatory notes to concise observations about largest moves, recent volatility, quote timing, benchmark differences, or data gaps. Do not provide personalized investment advice or unsupported causes for price changes.

## Report format and delivery

Use a short report with these sections:

1. **Painel de preços:** three separate groups with latest price and the available percentage variations for every requested asset.
2. **Variações em destaque:** a few concise observations grounded in the displayed values and periods; include quote-time caveats when needed.
3. **Fontes e critérios:** define FX regime, commodity benchmark/unit, return windows, timestamps, and any missing data or provider differences.

Start from [assets/relatorio-base-moedas-cripto-commodities.html](assets/relatorio-base-moedas-cripto-commodities.html). Preserve embedded CSS, responsive labeled cards for narrow screens, semantic table headers, and accessible horizontal scrolling where applicable. Keep the final report standalone and in Brazilian Portuguese.

Save generated reports under `smart-reports/moedas-cripto-commodities/` using `<nome-do-relatorio>_DD-MM-YYYY_HH-MM.html` with local 24-hour time. Do not create a PDF unless requested.
