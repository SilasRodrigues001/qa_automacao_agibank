# Casos de Teste

## WEB

| ID | Cenário | Pré-condição | Passos | Resultado esperado | Automação |
| --- | --- | --- | --- | --- | --- |
| WEB-01 | Pesquisa com termo existente | Blog disponível | Acessar blog; pesquisar `cartão` | A busca é processada e existem resultados relacionados | Sim |
| WEB-02 | Pesquisa sem correspondência | Blog disponível | Acessar blog; pesquisar string inexistente | A busca é processada sem apresentar artigo correspondente | Sim |
| WEB-03 | Pesquisa com caracteres especiais | Blog disponível | Pesquisar caracteres especiais | Aplicação trata a entrada sem erro 5xx | Manual/exploratório |
| WEB-04 | Pesquisa com espaço antes/depois | Blog disponível | Pesquisar termo com espaços | Comportamento é consistente com a regra da aplicação | Manual/exploratório |

## API

| ID | Endpoint | Cenário | Validações | Automação |
| --- | --- | --- | --- | --- |
| API-01 | `/breeds/list/all` | Listar raças | HTTP 200, `status=success`, `message` objeto, sub-raças em arrays | Sim |
| API-02 | `/breed/hound/images` | Listar imagens de raça válida | HTTP 200, `status=success`, lista não vazia, URLs HTTP/HTTPS | Sim |
| API-03 | `/breeds/image/random` | Obter imagem aleatória | HTTP 200, `status=success`, URL válida | Sim |
| API-04 | `/breed/qa-nonexistent-breed/images` | Raça inexistente | HTTP 404, `status=error`, mensagem preenchida, `code=404` | Sim |
| API-05 | `/breed/Hound/images` | Sensibilidade a maiúsculas | Validar comportamento documentado/observado | Manual/exploratório |

## Performance

| ID | Tipo | Perfil | Critério principal | Evidência |
| --- | --- | --- | --- | --- |
| PERF-01 | Carga | Ramp-up + 250 req/s sustentados | Throughput >= 250 req/s e p90 < 2 s | JTL + dashboard HTML |
| PERF-02 | Pico | 100 -> 500 -> 250 req/s | Observar erros, latência e recuperação após pico | JTL + dashboard HTML |

## Observação de cobertura

Os casos manuais adicionais foram documentados para mostrar riscos percebidos sem aumentar a suíte automatizada com cenários de baixo retorno ou comportamento pouco definido pelo enunciado. A automação prioriza os fluxos de maior valor e os requisitos explícitos.
