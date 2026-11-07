---
name: financial-dashboard-report
description: Create or update a concise HTML dashboard comparing publicly traded banks and financial companies for a long-term investor, using the user's approved Brazilian data sources.
metadata:
  short-description: Create a sourced financial dashboard report
---

# Financial dashboard report

Use this skill when the user asks to create, refresh, or adapt the bank and financial-company HTML report. Save the finished report as a standalone HTML file in the repository root unless the user requests another location.

## Data sources

Use only these sources for market indicators, company descriptions, and financial results:

- [Investidor10](https://investidor10.com.br/)
- [Status Invest](https://statusinvest.com.br/)
- [AUVP Analítica](https://analitica.auvp.com.br/)

Browse current data each time the report is refreshed. Link the relevant pages in the report. If one site is unavailable or does not provide a requested metric, use the other approved sources and mark the gap; do not silently fill it from another site. Do not present a metric as current without checking its displayed quote date and financial-statement period.

## Report structure

Keep the report compact and make the dashboard the visual and informational center. Use four numbered parts:

1. **Empresas:** a brief description of each company and its business model. Distinguish banks from insurers, holdings, BDRs, and other securities.
2. **Dashboard:** the latest available price, 12-month price change, P/L, P/VP, DY, ROE, ROA, payout, net margin, and average daily liquidity when available. Include other relevant bank measures such as capital ratios, credit growth, non-performing loans, and provisions when the approved sources report them.
3. **Métricas:** short plain-language explanations for every metric shown in the dashboard. Explain any metric that is not comparable for a company or sector.
4. **Conclusões:** use a bullet list with one item per asset. Give a concise interpretation grounded in its dashboard metrics, including the main trade-off or item to monitor. Avoid personalized buy/sell instructions.

Add a visible data-reference date. Note when quote dates, balance-sheet periods, or calculation methods differ across the source sites. Keep historical dividend yield distinct from expected future income. For banks, do not use net debt/EBITDA as a primary measure; deposits and funding are part of the business model.

## Reusable base

Start from [assets/relatorio-base-atual.html](assets/relatorio-base-atual.html) when creating another report in this series. It is a snapshot of the user's approved report design and section order, not a source of current data. Replace the company list, data, date, source links, caveats, and conclusions to match the new request. Keep the dark teal header, compact card layout, horizontally scrollable metric table, mobile behavior, print styling, and embedded CSS unless the user asks for a different design.

The current example includes Nu Holdings via ROXO34 (a BDR with 1 underlying share represented by 6 BDRs) and XP Inc. via XPBR31. Keep the distinction between banks and broader financial-services platforms clear. Check ticker status, BDR parity, source quote dates, and metric availability on the approved sources each time; mark unavailable values instead of inferring them. Only include companies the user requested; do not add Caixa Econômica Federal, Caixa Seguridade, or any other company by default.

## Output quality

- Use Brazilian Portuguese unless the user asks for another language.
- Use concise labels, consistent units, and Brazilian number formatting.
- Show `n/d` for missing data and say why when material.
- Keep links adjacent to the source list or relevant data, and avoid sources outside the approved three domains.
- Preserve accessibility: semantic headings, table headers, keyboard-scrollable overflow, responsive layout, and readable contrast.
- Do not run tests or validation checks unless the user asks for verification. Report any limitations plainly.
