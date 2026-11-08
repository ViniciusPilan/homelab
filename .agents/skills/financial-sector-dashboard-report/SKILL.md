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

## Data sources

Use only these sources for market indicators, company descriptions, and financial results:

- [Investidor10](https://investidor10.com.br/)
- [Status Invest](https://statusinvest.com.br/)
- [AUVP Analítica](https://analitica.auvp.com.br/)

Browse current data each time the report is refreshed. Link the relevant pages in the report. If one site is unavailable or does not provide a requested metric, use the other approved sources and mark the gap; do not silently fill it from another site. Do not present a metric as current without checking its displayed quote date and financial-statement period.

## Report structure

Keep the report compact and make the dashboard the visual and informational center. Use four numbered parts:

1. **Empresas:** a brief description of each bank and its business model. Identify BDRs and their underlying shares when applicable; exclude non-bank companies from the comparison.
2. **Dashboard:** the latest available price, 12-month price change, P/L, P/VP, DY, ROE, ROA, payout, net margin, and average daily liquidity when available. Include other relevant bank measures such as capital ratios, credit growth, non-performing loans, and provisions when the approved sources report them.
3. **Métricas:** short plain-language explanations for every metric shown in the dashboard. Explain any metric that is not comparable for a company or sector.
4. **Conclusões:** use a bullet list with one item per asset. Give a concise interpretation grounded in its dashboard metrics, including the main trade-off or item to monitor. Avoid personalized buy/sell instructions.

Add a visible data-reference date. Note when quote dates, balance-sheet periods, or calculation methods differ across the source sites. Keep historical dividend yield distinct from expected future income. For banks, do not use net debt/EBITDA as a primary measure; deposits and funding are part of the business model.

## Reusable base

Start from [assets/relatorio-base-atual.html](assets/relatorio-base-atual.html) when creating another report in this series. It is a snapshot of the user's approved report design and section order, not a source of current data. Replace the company list, data, date, source links, caveats, and conclusions to match the new request. Keep the dark teal header, compact cards, responsive metric table, and embedded CSS unless the user asks for a different design. The HTML must be comfortable to read directly in a browser on both desktop and phone. Tables should fit notebook-width screens with wrapped cell content and become labeled, readable metric cards on narrow phone screens; preserve semantic table headers for accessibility and retain keyboard-accessible horizontal scrolling as a fallback.

The current example includes Nu Holdings via ROXO34 (a BDR with 1 underlying share represented by 6 BDRs). Check that every requested issuer meets the bank-only scope, and check ticker status, BDR parity, source quote dates, and metric availability on the approved sources each time; mark unavailable values instead of inferring them. Only include companies the user requested; do not add Caixa Econômica Federal, Caixa Seguridade, or any other company by default. Caixa Econômica Federal is a bank and may be included if requested; Caixa Seguridade is an insurer and is out of scope.

## Output quality

- Use Brazilian Portuguese unless the user asks for another language.
- Use concise labels, consistent units, and Brazilian number formatting.
- Show `n/d` for missing data and say why when material.
- Keep links adjacent to the source list or relevant data, and avoid sources outside the approved three domains.
- Preserve accessibility: semantic headings, table headers, keyboard-scrollable overflow, responsive layout, and readable contrast.
- Do not run tests or validation checks unless the user asks for verification. Report any limitations plainly.
