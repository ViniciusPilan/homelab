---
name: equity-sector-dashboard-report
description: Create or update a responsive HTML report about listed Brazilian companies outside banking, including sanitation, electric utilities, commodities, and industrial sectors. Use the bank-specific skill for banks.
metadata:
  short-description: Create a sourced sector-aware equity dashboard
---

# Equity sector dashboard report

Use this skill for listed Brazilian companies outside banking, including sanitation, electric utilities, commodities, and industrial equipment. Follow the shared research, data-handling, and HTML workflow in [brazilian-market-dashboard-core](../brazilian-market-dashboard-core/SKILL.md). This skill controls company scope, source selection, sector metrics, and interpretation.

## Scope and classification

Include only requested companies and tickers. Exclude banks from this workflow; route bank-stock requests to `financial-sector-dashboard-report`. When updating the established non-bank Brazilian equity watchlist, cover every ticker in this canonical list unless the user narrows the scope:

- **Saneamento:** CSMG3 — Companhia de Saneamento de Minas Gerais (Copasa) ON; SAPR11 — Companhia de Saneamento do Paraná (Sanepar) UNIT; SBSP3 — Companhia de Saneamento Básico do Estado de São Paulo (Sabesp) ON. Cover water supply, sewage collection and treatment, concessions, regulation, and investment commitments.
- **Energia elétrica:** ALUP4 — Alupar Investimento S.A. PN; CPFE3 — CPFL Energia S.A. ON; TAEE11 — Transmissora Aliança de Energia Elétrica S.A. UNIT. Classify each issuer by actual business activity and segment. Distinguish transmission from distribution and generation; Alupar and Taesa have material transmission exposure, while CPFL has distribution and other electricity businesses. Confirm the current business mix from issuer sources.
- **Commodities, materiais e indústria:** PETR4 — Petróleo Brasileiro S.A. (Petrobras) PN; SUZB3 — Suzano S.A. ON; VALE3 — Vale S.A. ON; WEGE3 — WEG S.A. ON. Identify each company's products and material segments. Petrobras is an integrated oil and gas producer/refiner, Vale is exposed to iron ore and base metals, Suzano principally to pulp and paper, and WEG is an industrial equipment manufacturer; do not assume they share the same commodity exposure or operating drivers.

Confirm the issuer, ticker, share class, listing status, and business mix from current sources. Treat this list as the expected coverage, not as an instruction to force every company into one sector or one ranking. Explain material changes such as privatization, acquisitions, new concessions, or project ramp-ups when they affect interpretation. Do not add companies the user did not request.

## Sources and freshness

Prefer primary sources for company-specific facts and operating results: issuer investor-relations pages, earnings releases, financial statements, and reference forms; use B3 and CVM records for listing, filings, and corporate facts where relevant. Market-data sites such as Investidor10, Status Invest, or AUVP Analítica may be used for market multiples and liquidity.

## Equity dashboard requirements

Use the shared four-part report structure. Identify each company's ticker/share class, business, principal revenue drivers, and relevant operating exposure. Build a common comparison panel only for meaningfully comparable measures; add sector-specific panels and avoid ranking unlike business models together. Label currencies and units, including R$, US$, tonnes, MWh, and percentages.

## Common metrics

Use a consistent basis across companies where possible:

- Price, 12-month return, and average daily traded financial volume.
- P/L, P/VP, and EV/EBITDA when meaningful and available. Explain that accounting profits, asset bases, depreciation, investment cycles, and commodity cycles can make multiples hard to compare. Do not treat one multiple as a conclusion by itself.
- Historical dividend yield and payout, with the period and source stated. Discuss distributions alongside cash generation, investment needs, debt covenants, and announced policy.
- Revenue, EBITDA, margins, net income, operating cash flow, free cash flow, capex, net debt/EBITDA, debt cost, maturity profile, and currency/index exposure when reported.
- Prefer multi-year history that includes different operating or commodity conditions. Distinguish recurring performance from impairments, asset sales, tax effects, and other non-recurring items.

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

Start from [assets/relatorio-base-setorial.html](assets/relatorio-base-setorial.html), a copy of the established dashboard design. Preserve its dark teal header, compact company cards, and embedded CSS unless the user requests a different design. Adapt tables to requested issuers and sectors; use sector-specific columns or separate tables where that improves comparability.
