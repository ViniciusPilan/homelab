# Extrator de criptomoedas

Busca Bitcoin, Ethereum, XRP e Solana no Investidor10. A saída reúne a cotação
atual em dólares, o histórico de 30 dias e as variações de 24 horas e 12 meses
apresentadas nas páginas de cada criptoativo. O histórico usa a rota JSON
consultada pelo gráfico do site e contém 30 datas consecutivas; quando não há
registro para uma data, o último preço conhecido é repetido.

## Uso

Execute a partir de qualquer diretório:

```sh
python3 internal-tools/investment-report/extractor/crypto/main.py
```

É necessário ter Python 3 e acesso à internet. O script usa apenas a biblioteca
padrão do Python.

## Saída

Cada item do JSON tem `name`, `values`, `variation_30d`, `variation_24h` e
`variation_12m`.
`values` é um vetor de 30 preços numéricos em USD, ordenado do mais antigo ao
mais recente; seu último valor é a cotação atual em dólares da página. As
variações de 24h e 12m são mantidas no formato percentual exibido pelo Investidor10.
`variation_30d` é
calculada com a diferença percentual entre o primeiro e o último valor do vetor,
com sinal explícito positivo ou negativo.

Os arquivos são gravados em `results/` com data e hora local e em `latest.json`.
