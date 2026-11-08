---
name: equity-sector-dashboard-report
description: Create or update a concise HTML dashboard for Brazilian listed companies in banking, sanitation, electric utilities, and commodities, using sector-specific operating and financial metrics.
metadata:
  short-description: Create a sourced sector-aware equity dashboard
---

# Equity sector dashboard report

Use this skill when the user asks to create, refresh, or adapt an HTML report about Brazilian listed companies in banking, sanitation, electric utilities, or commodity producers. Follow the shared report location and file format in the repository `AGENTS.md`.

## Scope and classification

Include only the companies and tickers requested. When the request is to update the user's established Brazilian equity watchlist, cover every ticker in this canonical list unless the user narrows the scope:

- **Bancos:** BBAS3 — Banco do Brasil S.A. ON; BBDC4 — Banco Bradesco S.A. PN; BPAC11 — Banco BTG Pactual S.A. UNIT; ITUB4 — Itaú Unibanco Holding S.A. PN. Do not apply industrial-company debt or EV/EBITDA interpretations to banks; deposits, funding, capital adequacy, credit quality, and provisions are central to their analysis.
- **Saneamento:** CSMG3 — Companhia de Saneamento de Minas Gerais (Copasa) ON; SAPR11 — Companhia de Saneamento do Paraná (Sanepar) UNIT; SBSP3 — Companhia de Saneamento Básico do Estado de São Paulo (Sabesp) ON. Cover water supply, sewage collection and treatment, concessions, regulation, and investment commitments.
- **Energia elétrica:** ALUP4 — Alupar Investimento S.A. PN; CPFE3 — CPFL Energia S.A. ON; TAEE11 — Transmissora Aliança de Energia Elétrica S.A. UNIT. Classify each issuer by actual business activity and segment. Distinguish transmission from distribution and generation; Alupar and Taesa have material transmission exposure, while CPFL has distribution and other electricity businesses. Confirm the current business mix from issuer sources.
- **Commodities, materiais e indústria:** PETR4 — Petróleo Brasileiro S.A. (Petrobras) PN; SUZB3 — Suzano S.A. ON; VALE3 — Vale S.A. ON; WEGE3 — WEG S.A. ON. Identify each company's products and material segments. Petrobras is an integrated oil and gas producer/refiner, Vale is exposed to iron ore and base metals, Suzano principally to pulp and paper, and WEG is an industrial equipment manufacturer; do not assume they share the same commodity exposure or operating drivers.

Confirm the issuer, ticker, share class, listing status, and business mix from current sources. Treat this list as the expected coverage, not as an instruction to force every company into one sector or one ranking. Explain material changes such as privatization, acquisitions, new concessions, or project ramp-ups when they affect interpretation. Do not add companies the user did not request.

## Sources and freshness

Browse current data each time the report is created or refreshed. Prefer primary sources for company-specific facts and operating results: issuer investor-relations pages, earnings releases, financial statements, and reference forms; use B3 and CVM records for listing, filings, and corporate facts where relevant. Market-data sites such as Investidor10, Status Invest, or AUVP Analítica may be used for market multiples and liquidity when they show the relevant date and calculation basis. Link sources next to the data or in a compact source list.

Do not silently combine inconsistent definitions. Record the quote date, financial-statement period, currency, unit, and source for important metrics. Mark unavailable values as `n/d`, explain material gaps, and do not infer current values from old reports. Separate historical dividend yield from announced, approved, or projected payments. Distinguish reported results from guidance and analyst estimates.

## Report structure

Keep the report concise and make the dashboard its visual center. Use four numbered parts:

1. **Empresas:** brief business description, ticker/share class, principal revenue drivers, and relevant segment or concession exposure.
2. **Dashboard:** a common comparison panel plus the operating metrics relevant to the requested sectors. Show latest price, 12-month return, valuation, dividends, debt, and liquidity when available; add sector measures described below. Avoid forcing a single ranking across different business models.
3. **Métricas:** plain-language definitions for every displayed metric. State when a metric is weakly comparable or misleading for a particular business.
4. **Conclusões:** one concise item per requested asset, grounded in reported metrics and identifying its main trade-off or monitoring point. Do not give personalized buy/sell instructions.

Include a visible reference date. Keep Brazilian number formatting and label currencies and units, including R$, US$, tonnes, MWh, and percentages as applicable.

## Common metrics

Use a consistent basis across companies where possible:

- Price, 12-month return, and average daily traded financial volume.
- P/L, P/VP, and EV/EBITDA when meaningful and available. Explain that accounting profits, asset bases, depreciation, investment cycles, and commodity cycles can make multiples hard to compare. Do not treat one multiple as a conclusion by itself.
- Historical dividend yield and payout, with the period and source stated. Discuss distributions alongside cash generation, investment needs, debt covenants, and announced policy.
- Revenue, EBITDA, margins, net income, operating cash flow, free cash flow, capex, net debt/EBITDA, debt cost, maturity profile, and currency/index exposure when reported.
- Prefer multi-year history that includes different operating or commodity conditions. Distinguish recurring performance from impairments, asset sales, tax effects, and other non-recurring items.
- For banks, prioritize ROE, ROA, net interest income/spread, efficiency ratio, loan portfolio growth and mix, non-performing loans/arrears, cost of risk and provisions, capital adequacy (Basel/CET1 when available), and recurring versus extraordinary earnings. Treat bank dividend payout and yield in the context of capital needs and applicable distribution policy. Do not compare bank leverage or margins directly with non-financial issuers.

Do not use ROE, ROA, or net margin as universal headline comparisons. They may be included as supporting measures with the accounting basis and comparability caveat stated.

## Sector-specific metrics

Include only the sector metrics that apply to a requested company; do not fill the dashboard with irrelevant columns.

### Saneamento

- Water and sewage coverage, connections served, treatment level, and progress toward service or universalization targets.
- Water losses and operational efficiency; billed volume, customer mix, and collection/arrears where disclosed.
- Tariff adjustments and regulatory reviews, concession/contract term, allowed returns or other relevant regulatory mechanisms.
- Planned versus delivered capex, expansion milestones, and cash flow after investment.
- Explain differences in concession scope, regulatory rules, geography, and investment stage when comparing companies such as Sabesp and Sanepar.

### Electric utilities

Separate transmission from distribution and generation; never compare their operating metrics as if they measured the same business.

- **Transmission (such as Taesa):** Receita Anual Permitida (RAP), asset availability, variable deductions/penalties, concessions and remaining terms, projects under construction and their expected entry into service, capex, and financing needs. Explain the contract and tariff-cycle context.
- **Distribution (including CPFL's distribution operations):** distributed energy/volume, losses, continuity and quality indicators, tariff adjustments and reviews, customer base, and segment contribution. Include generation or other material business segments separately where applicable.
- For any utility, connect capex and project returns to leverage, cash flow, concession obligations, and dividend capacity.

### Oil, gas, and industrial equipment

- **Petrobras:** report production and sales by oil/gas product where available, lifting cost with its definition and unit, refining utilization/margins, realized prices, reserves and replacement, investment and project delivery, net debt, and sensitivity to Brent, exchange rates, and fuel pricing policy. Separate reported results from corporate guidance and policy targets.
- **WEG:** cover revenue and order intake/backlog by business or geography when disclosed, delivered volumes or production indicators, operating margin, return on capital, exports and currency exposure, capacity expansion, capex, and the contribution of acquisitions or non-recurring items. Do not apply mining or pulp unit-cost metrics to an equipment manufacturer.

### Commodity producers

- Production and sales volumes by relevant product, realized selling prices, product/segment mix, inventories where material, and guidance versus delivered results.
- Unit operating costs (for example, cash cost per tonne and all-in cost where the issuer reports them), productivity, and operating margin by product.
- Capex, project ramp-up, free cash flow, net debt, and sensitivity to commodity prices, freight, exchange rates, energy and input costs.
- **Vale:** distinguish iron ore from copper, nickel, and other material segments; identify the product and cost definition for every unit-cost figure.
- **Suzano:** track pulp and paper volumes/prices, cash cost per tonne, forestry/fiber availability, new capacity and ramp-up, capex, and foreign-currency revenue versus costs/debt.
- Commodity prices are cyclical. Interpret current earnings and valuation against longer history and do not extrapolate peak or trough earnings as a steady state.

## Reusable design and output quality

Start from [assets/relatorio-base-setorial.html](assets/relatorio-base-setorial.html), a copy of the established dashboard design. Preserve its dark teal header, compact company cards, responsive metric tables, print styling, and embedded CSS unless the user requests a different design. Tables should fit notebook-width screens with wrapped cell content and become labeled, readable metric cards on narrow phone screens; preserve semantic table headers for accessibility and retain horizontal scrolling as a fallback where needed. Adapt the table to the requested issuers and sectors; it is acceptable to use clearly labeled sector-specific columns or separate tables when that improves comparability.

Use Brazilian Portuguese unless requested otherwise. Preserve semantic headings and table headers, keyboard-scrollable table overflow, responsive layout, and readable contrast. Keep conclusions evidence-based and state limitations plainly. Do not run tests or validation checks unless the user asks for verification.
