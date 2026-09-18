# Relatório de Execução - Performance

> Preencher com os números reais depois da execução. Não marcar aprovação antes de coletar as métricas.

## Identificação

- Data/hora:
- Executor:
- Máquina geradora de carga:
- CPU / memória:
- Sistema operacional:
- Java:
- JMeter:
- Rede/local da execução:

## Critério de aceite

- Throughput: 250 req/s;
- P90: < 2 s.

## Teste de carga

| Métrica | Resultado |
| --- | ---: |
| Requisições |  |
| Throughput |  |
| Média |  |
| P90 |  |
| P95 |  |
| P99 |  |
| Error % |  |

### Parecer

- Throughput >= 250 req/s: **[ATENDIDO / NÃO ATENDIDO]**
- P90 < 2 s: **[ATENDIDO / NÃO ATENDIDO]**
- Erros relevantes: **[SIM / NÃO]**

Conclusão:

> Registrar aqui a conclusão objetiva, citando os números observados e qualquer limitação do ambiente.

## Teste de pico

| Estágio | Throughput observado | P90 | Error % | Observação |
| --- | ---: | ---: | ---: | --- |
| Baseline - 100 req/s |  |  |  |  |
| Pico - 500 req/s |  |  |  |  |
| Recuperação - 250 req/s |  |  |  |  |

### Parecer

> Descrever se houve degradação no pico, aumento de erros e se o serviço retornou ao comportamento esperado na etapa de recuperação.

## Evidências

- `performance/results/load.jtl`
- `performance/results/load-report/`
- `performance/results/spike.jtl`
- `performance/results/spike-report/`
