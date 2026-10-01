# Relatório de revisão de código — Alternância de unidade de temperatura

## Resumo
- Data: 2026-10-01
- Branch: `task-unidade`
- Status: **APROVADO COM RESSALVAS**

## Conformidade com regras
| Regra | Status | Observações |
|------|--------|-------------|
| Padrões de código | OK | Identificadores e código técnico em inglês; arquivos e funções respeitam os limites de linhas; nenhuma função nova excede três parâmetros. |
| Estrutura de pastas | OK | View em `views/`, componentes em `components/weather/`, utilitário puro em `lib/` e tipo compartilhado em `types/`. |
| Regras para React | OK | Estado de alternância é local à tela, os componentes recebem props explícitas e a apresentação usa classes Tailwind. |
| Regras de testes | OK | Utilitário, componentes e integração da tela têm cobertura correspondente; testes seguem Given/When/Then e isolam a consulta externa. Cobertura supera 80% em todas as métricas. |

## Aderência à TechSpec
| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| Estado local inicial em Celsius, sem persistência | SIM | `WeatherView` inicia em `celsius`; remontar a tela restaura esse padrão. |
| Controle acessível para alternar a unidade | SIM | `TemperatureUnitToggle` expõe o estado com `aria-pressed` e informa a unidade atual e a próxima no rótulo acessível. |
| Conversão e formatação centralizadas | SIM | `formatTemperature` converte Celsius para Fahrenheit, limita a uma casa decimal e trata valores nulos ou não finitos como indisponíveis. |
| Aplicação consistente nas condições atuais e previsão | SIM | Cartão atual, sensação térmica e mínimas/máximas diárias recebem a unidade da tela; umidade e vento permanecem inalterados. |
| Sem alteração de API ou dependências | SIM | A unidade é apenas estado de apresentação; não há mudança no contrato com o backend nem nova dependência. |

## Tarefas verificadas
| Tarefa | Status | Observações |
|------|--------|-------------|
| task_1 — tipo e formatação de temperatura | COMPLETA | Utilitário, tipo e testes unitários presentes; casos Celsius/Fahrenheit, arredondamento e indisponibilidade cobertos. |
| task_2 — controle de alternância | COMPLETA | Componente acessível e testes para unidades, rótulos e interação presentes. |
| task_3 — integração com a tela e cartões | COMPLETA | Estado integrado à view e aos cartões; testes de integração, regressão visual e acessibilidade presentes. |

## Testes
- Total de testes: 55
- Passando: 55
- Falhando: 0
- Cobertura: statements 98,12%; branches 90,62%; funções 98,5%; linhas 99,4% (mínimo exigido: 80% em cada métrica).
- `cd frontend && npm run test:coverage`: aprovado.
- `cd frontend && npm run lint`: aprovado, com um aviso preexistente em `src/components/ui/button.tsx:51` (`react-refresh/only-export-components`); nenhum erro.
- `cd frontend && npm run typecheck`: aprovado.
- `cd frontend && npm run build`: aprovado.
- `git diff --check`: aprovado.

## Problemas encontrados
| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Baixa | `AGENTS.md` | — | A seção do frontend diz que não há testes automatizados configurados, mas o projeto executa a suíte Vitest e o comando de cobertura. A documentação contradiz as ferramentas disponíveis. | Atualizar a seção de comandos do frontend em uma alteração de documentação do projeto. |
| Baixa | `frontend/src/components/ui/button.tsx` | 51 | O lint reporta um aviso `react-refresh/only-export-components` em arquivo fora das alterações desta funcionalidade. Não afeta a execução do lint nem os testes. | Avaliar a exportação em uma manutenção própria do componente. |

## Pontos positivos
- Conversão de unidade isolada em utilitário puro e compartilhado pelos cartões.
- A escolha fica na camada de apresentação e não altera consultas meteorológicas nem contratos da API.
- Testes cobrem a conversão, a interação do controle e a propagação da unidade pela tela.
- A verificação manual de QA e suas evidências estão registradas em `qa.md` e `evidences/`.

## Recomendações
- Corrigir a orientação desatualizada sobre testes no `AGENTS.md` para que futuras validações usem os comandos disponíveis.
- Tratar o aviso existente de Fast Refresh em `button.tsx` fora do escopo desta funcionalidade.

## Conclusão
A implementação atende à TechSpec, às tarefas e às regras aplicáveis. Os testes, o typecheck, o lint e o build passaram, sem defeitos funcionais encontrados na alteração. O veredito é **APROVADO COM RESSALVAS** pelas duas pendências de manutenção listadas acima, ambas fora do escopo funcional desta entrega.
