---
name: financial-sector-dashboard-report
description: Create or update a responsive, browser-ready HTML intelligent sector report for publicly traded bank stocks, using the user's approved Brazilian data sources. Invoke when the user asks for a "relatório inteligente do setor financeiro" or an intelligent report about banks.
metadata:
  short-description: Create a sourced financial dashboard report
---

# Financial dashboard report

Use this skill when the user asks for a “relatório inteligente do setor financeiro” or to create, refresh, or adapt an HTML dashboard analyzing publicly traded bank stocks. Follow the shared report location and HTML naming rules in the repository `AGENTS.md`. Deliver a standalone HTML file for browser viewing; PDF is only an additional output when explicitly requested.

## Scope

Include only listed equity securities whose issuer's primary business is banking, such as commercial, universal, investment, or digital banks. A BDR may be included when it represents shares of a bank; identify the underlying issuer, ticker, and BDR ratio clearly. Include a diversified company only when banking is its primary business, and describe material non-bank operations where relevant.

Exclude companies whose primary business is insurance, brokerage, investments, asset management, payments, consumer finance, or a financial holding/conglomerate that is not itself primarily a bank. Do not include these securities just because they are financial companies or appear in the user's broader portfolio. If the request mixes bank stocks with other sectors, cover only the bank stocks with this skill; another sector-specific skill should handle the rest.

## Required bank set

Every report generated with this skill must include this same core set of five Brazilian bank issuers and tickers, regardless of whether the user supplies a watchlist:

- Itaú Unibanco — ITUB4
- BTG Pactual — BPAC11
- Bradesco — BBDC4
- Banco do Brasil — BBAS3
- Santander Brasil — SANB11

Do not omit BTG Pactual (BPAC11). Keep all five in the company section, dashboard, and conclusions. If a quote or metric cannot be verified from the approved sources, retain the bank and show `n/d` with a brief explanation; missing coverage is not a reason to remove an issuer. When a user explicitly requests additional bank tickers, include them alongside this core set if they meet the scope. Do not add non-bank securities.

## Data sources

Use only these sources for market indicators, company descriptions, and financial results:

- [Investidor10](https://investidor10.com.br/)
- [Status Invest](https://statusinvest.com.br/)
- [AUVP Analítica](https://analitica.auvp.com.br/)

Browse current data each time the report is refreshed. Link the relevant pages in the report. If one site is unavailable or does not provide a requested metric, use the other approved sources and mark the gap; do not silently fill it from another site. Do not present a metric as current without checking its displayed quote date and financial-statement period.

## Report structure

Keep the report compact and make the dashboard the visual and informational center. Use four numbered parts:

1. **Empresas:** a brief description of each bank and its business model. Identify BDRs and their underlying shares when applicable; exclude non-bank companies from the comparison.
2. **Dashboard:** the latest available price, 12-month price change, P/L, P/VP, DY, ROE, ROA, payout, net margin, average daily liquidity, **Índice de Basileia**, and **inadimplência**. Always provide dedicated columns/fields for Índice de Basileia and inadimplência for every bank in the required set. Use the latest figures available from the approved sources; if a source does not publish a figure, show `n/d` and explain the gap instead of omitting the metric or inferring it. Include the reporting date/period and the source's definition for each credit or capital metric. For inadimplência, identify the delinquency threshold (for example, above 90 days) and whether the value is an NPL ratio, overdue portfolio share, or another disclosed measure; do not compare unlike definitions as if equivalent. Include other relevant bank measures such as credit growth and provisions when the approved sources report them.
3. **Métricas:** short plain-language explanations for every metric shown in the dashboard. Explain any metric that is not comparable for a company or sector.
4. **Conclusões:** use a bullet list with one item per asset. Give a concise interpretation grounded in its dashboard metrics, including the main trade-off or item to monitor. Avoid personalized buy/sell instructions.

Add a visible data-reference date. Note when quote dates, balance-sheet periods, or calculation methods differ across the source sites. Keep historical dividend yield distinct from expected future income. For banks, do not use net debt/EBITDA as a primary measure; deposits and funding are part of the business model. Treat Índice de Basileia and inadimplência as core dashboard indicators, not optional observations relegated only to notes; preserve `n/d` fields when data is unavailable.

## Reusable base

Start from [assets/relatorio-base-atual.html](assets/relatorio-base-atual.html) when creating another report in this series. It is a snapshot of the user's approved report design and section order, not a source of current data. Replace the company list, data, date, source links, caveats, and conclusions to match the new request. Keep the dark teal header, compact cards, responsive metric table, and embedded CSS unless the user asks for a different design. The HTML must be comfortable to read directly in a browser on both desktop and phone. Tables should fit notebook-width screens with wrapped cell content and become labeled, readable metric cards on narrow phone screens; preserve semantic table headers for accessibility and retain keyboard-accessible horizontal scrolling as a fallback.

Check that each required issuer still meets the bank-only scope and that its ticker is active; verify source quote dates and metric availability each time, marking unavailable values instead of inferring them. Additional requested issuers must meet the same scope. Do not add Caixa Econômica Federal, Caixa Seguridade, or other companies by default. Caixa Econômica Federal is a bank and may be included when explicitly requested; Caixa Seguridade is an insurer and is out of scope. ROXO34 may be added only when explicitly requested; identify the underlying Nu Holdings shares and BDR ratio.

## Output quality

- Use Brazilian Portuguese unless the user asks for another language.
- Use concise labels, consistent units, and Brazilian number formatting.
- Show `n/d` for missing data and say why when material.
- Keep links adjacent to the source list or relevant data, and avoid sources outside the approved three domains.
- Preserve accessibility: semantic headings, table headers, keyboard-scrollable overflow, responsive layout, and readable contrast.
- Do not run tests or validation checks unless the user asks for verification. Report any limitations plainly.
