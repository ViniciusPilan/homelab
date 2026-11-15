# Extrator de commodities

Busca ouro, prata, petróleo Brent, soja, café Contrato C, arroz em casca e
minério de ferro 62% CFR nas páginas individuais do Investing.com Brasil. Cada registro contém o
preço atual em USD, a faixa de 52 semanas, o volume e a variação
percentual em 1 ano. O campo `unit` informa a unidade/contrato usado na cotação;
isso é especialmente relevante para grãos, cujo preço é por contrato ou
quintal, e não por tonelada.

## Uso

Execute a partir de qualquer diretório:

```sh
python3 internal-tools/investment-report/extractor/commodities/main.py
```

É necessário ter Python 3 e acesso à internet. O script usa apenas a biblioteca
padrão do Python.

## Saída

O JSON contém os campos `name`, `url`, `price_usd`, `range_52w` (`low` e
`high`), `volume`, `variation_1y_pct`, `history_30d` e `unit`. `history_30d` é
uma lista cronológica de pregões, cada um com `date` (AAAA-MM-DD) e `close`;
inclui os fechamentos disponíveis dentro da janela de 30 dias corridos, sem
inventar valores para fins de semana ou feriados.
Quando um campo não estiver disponível ou não puder ser interpretado, seu valor
será `"-"`; a coleta dos outros campos e ativos continua. Os preços e faixas
são valores numéricos na moeda USD quando encontrados. `variation_1y_pct` é um
percentual numérico, sem o caractere `%`, quando encontrado.

Os arquivos são gravados em `results/` com data e hora local e em `latest.json`.
O painel `render/commodities/` desenha um gráfico para cada série retornada. As
cotações são futuros/CFDs conforme o instrumento indicado em cada página do
Investing.com; os dados podem ter atraso e a página pode mudar sua estrutura.
