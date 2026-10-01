# Relatório de revisão de código — Painel de clima

## Resumo
- Data: 2026-10-01
- Branch: `docs/anotacoes-worktree`
- Status: **APROVADO COM RESSALVAS**

## Conformidade com regras
| Regra | Status | Observações |
|------|--------|-------------|
| Padrões de código: idioma, tamanho, parâmetros e fluxo | OK | A implementação da funcionalidade respeita os limites e a separação de responsabilidades definidos em `.agents/rules/code-standards.md`. |
| Estrutura de pastas | OK | Views, componentes, hooks, serviços, utilitários, tipos, gateways, rotas e serviços estão nas pastas previstas. |
| React e acessibilidade | OK | A tela usa componentes pequenos, props explícitas, Tailwind, rótulos, foco visível e anúncios de estado; QA documenta a validação funcional e responsiva. |
| Testes | OK | Testes unitários e de integração cobrem os arquivos com comportamento; limites de 80% foram atendidos em todas as métricas. |
| ESLint | OK COM AVISO | Sem erros. O frontend mantém um aviso Fast Refresh em `frontend/src/components/ui/button.tsx:51`; esse componente genérico já existia e não foi alterado nesta funcionalidade. |

## Aderência à TechSpec
| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| Separação entre view, hooks, service frontend, rotas, services e gateways | SIM | Criação da aplicação Express permite injetar o serviço nos testes. |
| Contratos `WeatherLocation`, `Coordinates` e `WeatherForecast` | SIM | Os tipos frontend/backend refletem os contratos documentados. |
| GET `/weather/locations` e POST `/weather` | SIM | Validação, respostas, cache `no-store` e envelope de erro estável estão implementados. |
| Integração Open-Meteo isolada no backend | SIM | Geocoding e forecast usam gateways com parâmetros definidos, timeout de quatro segundos e normalização de payload. |
| Previsão de sete dias e datas locais | SIM | A revisão endureceu a validação para rejeitar datas impossíveis, repetidas ou não consecutivas; o frontend não desloca o dia local ao formatar. |
| Geolocalização explícita sem geocodificação reversa | SIM | A posição só é solicitada após ação e segue diretamente para POST `/weather`. |
| Privacidade e observabilidade | SIM | Os eventos registram rota, duração, resultado e categoria de erro, sem consulta ou coordenadas. |
| Meta de p95 de cinco segundos | PARCIAL | Há eventos de duração para agregação no ambiente de execução. O relatório de QA registra que a medição estatística de CA-12 foi dispensada; o p95 não foi apurado nesta revisão. |

## Tarefas verificadas
| Tarefa | Status | Observações |
|------|--------|-------------|
| 1.0 — Contratos, validação e gateways | COMPLETA | Implementação e testes unitários presentes. |
| 2.0 — Endpoints, erros e observabilidade | COMPLETA | Testes de integração cobrem contratos, erros, cache e eventos. |
| 3.0 — Cliente e formatos frontend | COMPLETA | Cliente, tipos e formatadores têm testes unitários. |
| 4.0 — Componentes de apresentação | COMPLETA | Componentes e estados têm testes unitários; integração cobre conteúdo e nomes acessíveis. |
| 5.0 — Busca e geolocalização | COMPLETA | Hooks cobrem permissão explícita, falhas, retry e respostas concorrentes. |
| 6.0 — Composição e integração | COMPLETA | View, acessibilidade e fluxos de cidade/localização têm testes de integração; QA documenta os critérios funcionais e de responsividade. |

As subtarefas e os casos TU-01 a TU-08 e TI-01 a TI-06 estão marcados como concluídos em `tasks.md` e nos arquivos individuais. Os testes correspondentes estão presentes.

## Testes
- Total de testes: 131
- Passando: 131
- Falhando: 0
- Cobertura backend: statements 98,18%; branches 95,87%; funções 100%; linhas 99,30% (meta mínima 80%).
- Cobertura frontend: statements 98,00%; branches 90,41%; funções 98,43%; linhas 99,37% (meta mínima 80%).
- `npm run lint`, `npm run typecheck` e `npm run build`: aprovados nos dois aplicativos. O lint do frontend emitiu o aviso registrado acima.
- Nenhum servidor foi iniciado nesta revisão; não houve processos ou portas a liberar.

## Problemas encontrados
| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Média — corrigida | `backend/src/gateway/open-meteo-forecast-parser.ts` | 36 | O parser aceitava sete strings com formato de data mesmo quando a data era impossível ou o conjunto tinha repetição/lacuna, podendo gerar uma previsão que não cobria sete dias consecutivos. | Validar datas reais e consecutivas. Correção aplicada e coberta por regressões para data impossível, repetição e lacuna. |

## Pontos positivos
- Os erros do provedor são convertidos em mensagens estáveis, sem repassar payloads externos.
- A busca usa cancelamento e sequência de requisições para impedir que respostas antigas substituam consultas mais recentes.
- A cobertura automatizada supera o mínimo de 80% em todas as métricas nos dois projetos.
- A QA existente registra fluxos manuais, acessibilidade, responsividade, atribuição e ausência de chamadas do navegador a provedores externos.

## Recomendações
- Agregar os eventos de produção para medir o p95 de CA-12 antes de declarar a meta estatística atendida; a dispensa dessa medição está registrada em `qa.md`.
- Remover o aviso Fast Refresh do componente genérico de botão quando esse componente for revisado.

## Conclusão
A implementação está aderente à arquitetura, aos contratos e às regras aplicáveis. A única falha encontrada nesta revisão foi corrigida e revalidada. Testes, lint, typecheck, build e cobertura passaram. O veredito é **APROVADO COM RESSALVAS** porque o p95 de CA-12 não foi medido; a instrumentação necessária para apurá-lo está implementada e a dispensa estatística consta no relatório de QA.
