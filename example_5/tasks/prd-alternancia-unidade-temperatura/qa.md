# Relatório de QA — Alternância de unidade de temperatura

As capturas do navegador estão em `tasks/prd-alternancia-unidade-temperatura/evidences/`.

## Resumo

- Data: 2026-10-01
- Status: **APROVADO**
- Total de critérios de aceitação: 11
- Critérios de aceitação atendidos: 11
- Bugs encontrados: 1, corrigido e coberto por regressão
- Ambiente: backend em `http://127.0.0.1:3001`; frontend em `http://127.0.0.1:5101`

## Critérios de aceitação verificados

| ID | Critério de aceitação | Casos de teste | Status | Evidência |
|----|-----------------------|----------------|--------|-----------|
| CA-01 | Uma visita ou recarga inicia em Celsius; os valores carregados mostram °C. | TU-02, TI-02, E2E-01, E2E-04 | PASSOU | [estado vazio](evidences/01-empty-desktop.png), [previsão em Celsius](evidences/02-weather-celsius-desktop.png), [recarga](evidences/09-reload-celsius.png) |
| CA-02 | A troca para Fahrenheit atualiza temperatura atual, sensação térmica e mínimas/máximas dos sete dias. | TU-05, TU-06, TI-01, E2E-02 | PASSOU | [Fahrenheit](evidences/03-weather-fahrenheit-desktop.png) |
| CA-03 | 0 °C vira 32 °F e 100 °C vira 212 °F. | TU-01, TI-01, E2E-02 | PASSOU | [conversões determinísticas](evidences/03-weather-fahrenheit-desktop.png) |
| CA-04 | Voltar a Celsius restaura os valores de origem sem acumular arredondamento. | TU-03, TI-01, E2E-02 | PASSOU | [Celsius](evidences/02-weather-celsius-desktop.png), [Fahrenheit](evidences/03-weather-fahrenheit-desktop.png) |
| CA-05 | Todas as temperaturas usam a unidade selecionada; umidade e vento permanecem iguais. | TU-05, TU-06, TI-01, E2E-02 | PASSOU | [Fahrenheit](evidences/03-weather-fahrenheit-desktop.png) |
| CA-06 | Temperaturas nulas continuam indisponíveis, sem `NaN` ou infinito. | TU-03, TU-06, E2E-02 | PASSOU | [campo indisponível em Fahrenheit](evidences/03-weather-fahrenheit-desktop.png) |
| CA-07 | Uma nova busca na mesma aba mantém Fahrenheit e só gera as requisições próprias da busca. | TI-02, E2E-03 | PASSOU | [segunda cidade em Fahrenheit](evidences/04-second-city-fahrenheit.png) |
| CA-08 | Recarregar ou iniciar outra visita reinicia em Celsius. | TI-02, E2E-04 | PASSOU | [antes em Fahrenheit](evidences/04-second-city-fahrenheit.png), [recarga em Celsius](evidences/09-reload-celsius.png) |
| CA-09 | O controle funciona por teclado e comunica unidade ativa e destino de forma acessível. | TU-04, TI-03, E2E-05 | PASSOU | [foco por teclado](evidences/07-keyboard-focus.png) |
| CA-10 | A troca aparece em menos de um segundo e não faz nova consulta meteorológica. | TI-01, E2E-02 | PASSOU | [troca de unidade](evidences/03-weather-fahrenheit-desktop.png) |
| CA-11 | Formatação pt-BR exibe 23,4 °C como 74,1 °F e 25 °C como 77 °F, sem zero final. | TU-01, TU-02, TI-01, E2E-02 | PASSOU | [formatação em Fahrenheit](evidences/03-weather-fahrenheit-desktop.png) |

## Testes E2E executados no navegador

Os E2E abaixo foram explorações manuais com Playwright MCP. A TechSpec e `.agents/rules/tests.md` determinam que não sejam adicionados testes E2E automatizados.

| ID | Fluxo | Resultado | Observações |
|----|-------|-----------|-------------|
| E2E-01 | Abrir a tela e carregar uma previsão em Celsius. | PASSOU | Controle acessível como Celsius; dados atuais e sete dias exibidos em °C. |
| E2E-02 | Alternar a previsão entre Celsius e Fahrenheit, incluindo valores extremos e indisponíveis. | PASSOU | Resposta meteorológica carregada pelo backend local; transformação de resposta no navegador para valores determinísticos: 23,4, 25, 0, 100 e `null`. Exibiu 74,1 °F, 77 °F, 32 °F, 212 °F e `Indisponível`; umidade e vento não mudaram. A atualização do nome acessível do botão ocorreu em 5,5 ms após o clique no DOM. A lista de rede não ganhou chamadas na alternância. |
| E2E-03 | Pesquisar Porto após selecionar Fahrenheit. | PASSOU | A unidade continuou Fahrenheit. A busca fez um GET de localidades e um POST meteorológico; alternar unidade não adicionou chamadas. |
| E2E-04 | Recarregar a página após selecionar Fahrenheit. | PASSOU | A tela voltou vazia em Celsius; não há preferência em `localStorage`. |
| E2E-05 | Operar a página com Tab, Enter, Espaço e Escape. | PASSOU | Skip link é o primeiro foco, o controle vem em seguida e mostra foco visível; Enter e Espaço alternam. Escape não remove o foco nem altera a seleção. O próximo Tab alcança o campo Cidade. |
| E2E-06 | Simular resposta HTTP 503 no endpoint de localidades. | PASSOU | Falha injetada no navegador; a interface expôs uma mensagem clara em `role="alert"` com `aria-live="assertive"` e ação “Tentar novamente”. |
| E2E-07 | Verificar os layouts desktop, tablet e celular. | PASSOU | Larguras de 1200, 768 e 390 px; previsão em sete, três e duas colunas, respectivamente, sem rolagem horizontal. |

## Testes automatizados e cobertura

| Camada | ID | Resultado | Validação/comando | Observações |
|--------|----|-----------|-------------------|------------|
| Unidade | TU-01 | PASSOU | `cd frontend && npm run test:coverage` | Conversões 0, 100 e fracionária. |
| Unidade | TU-02 | PASSOU | `cd frontend && npm run test:coverage` | pt-BR, uma casa decimal opcional e símbolos das unidades. |
| Unidade | TU-03 | PASSOU | `cd frontend && npm run test:coverage` | Nulos e fonte Celsius preservados. |
| Unidade | TU-04 | PASSOU | `cd frontend && npm run test:coverage` | Nome acessível, estado pressionado, Enter e Espaço. |
| Unidade | TU-05 | PASSOU | `cd frontend && npm run test:coverage` | Atual e sensação térmica; umidade e vento preservados. |
| Unidade | TU-06 | PASSOU | `cd frontend && npm run test:coverage` | Mínimas/máximas e valores nulos. |
| Integração | TI-01 | PASSOU | `cd frontend && npm run test:coverage` | Alterna todos os campos sem aumentar chamadas à API. |
| Integração | TI-02 | PASSOU | `cd frontend && npm run test:coverage` | Mantém Fahrenheit entre buscas; remontagem reinicia em Celsius. |
| Integração | TI-03 | PASSOU | `cd frontend && npm run test:coverage` | Ordem de foco e operação por teclado. |
| Tipos | — | PASSOU | `cd frontend && npm run typecheck` | TypeScript concluiu sem erros. |
| Lint | — | PASSOU | `cd frontend && npm run lint` | Sem erros; há um aviso preexistente em `src/components/ui/button.tsx:51` (`react-refresh/only-export-components`). |

- Suíte: 23 arquivos, 55 testes aprovados.
- Cobertura: statements 98,12%; branches 90,62%; functions 98,50%; lines 99,40%. Todas as métricas excedem a meta de 80%.

## Acessibilidade

- [x] Tab, Enter, Espaço e Escape verificados; foco visível no botão.
- [x] Controle anuncia a unidade ativa e a unidade de destino; campo Cidade tem nome acessível.
- [x] Não há imagens `<img>` nesta tela; o ícone SVG de localização é decorativo (`aria-hidden="true"`).
- [x] Contraste verificado: placeholder Cidade passou de 2,56:1 para 4,76:1; texto sky-100 no card meteorológico tem pelo menos 5,17:1 sobre a cor sky-700; texto branco sobre essa cor tem 5,93:1.
- [x] Campo Cidade tem `<label for="city-search">` associado.
- [x] Falha de serviço usa alerta assertivo com texto claro e ação de nova tentativa.
- [x] Texto principal tem 14 px ou mais; rodapé usa 12 px.

## Verificação visual e responsividade

- [x] Estado vazio e desktop: [01-empty-desktop.png](evidences/01-empty-desktop.png).
- [x] Dados em Celsius: [02-weather-celsius-desktop.png](evidences/02-weather-celsius-desktop.png).
- [x] Dados em Fahrenheit: [03-weather-fahrenheit-desktop.png](evidences/03-weather-fahrenheit-desktop.png).
- [x] Segunda cidade ainda em Fahrenheit: [04-second-city-fahrenheit.png](evidences/04-second-city-fahrenheit.png).
- [x] Celular, 390 × 844: [05-weather-fahrenheit-mobile.png](evidences/05-weather-fahrenheit-mobile.png).
- [x] Tablet, 768 × 1024: [06-weather-fahrenheit-tablet.png](evidences/06-weather-fahrenheit-tablet.png).
- [x] Foco de teclado: [07-keyboard-focus.png](evidences/07-keyboard-focus.png).
- [x] Erro de serviço: [08-error-alert.png](evidences/08-error-alert.png).
- [x] Recarga reiniciada em Celsius: [09-reload-celsius.png](evidences/09-reload-celsius.png).
- [x] Nenhuma inconsistência visual ou de responsividade permaneceu após o ajuste de contraste.

## Bugs encontrados e corrigidos

| ID | Descrição | Severidade | Status | Correção | Teste de regressão | Evidência |
|----|-----------|------------|--------|----------|--------------------|-----------|
| BUG-01 | Placeholder do campo Cidade tinha contraste 2,56:1 em fundo branco. | Baixa | Corrigido | Classe Tailwind alterada de `placeholder:text-slate-400` para `placeholder:text-slate-500` (4,76:1). | Teste em `WeatherSearchForm.test.tsx` protege a classe de contraste aprovada. | [tela vazia](evidences/01-empty-desktop.png) |

## Conclusão

Os 11 critérios de aceitação foram verificados e atendidos. Os 55 testes automatizados passaram, a cobertura excede 80% nas quatro métricas e os fluxos de interface passaram nos tamanhos avaliados. O defeito de contraste foi corrigido e ganhou teste de regressão. **QA APROVADO.**
