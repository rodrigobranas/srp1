# Relatório de QA — Tema claro/escuro

## Resumo

- Data: 2026-10-01
- Status: APROVADO
- Total de critérios de aceitação: 9
- Critérios de aceitação atendidos: 9
- Bugs encontrados e corrigidos: 1

## Critérios de aceitação verificados

| ID | Critério de aceitação | Casos de teste | Status | Evidência |
|---|---|---|---|---|
| CA-01 | Uma nova aba inicia no tema escuro. | TU-01, E2E-01 | PASSOU | [tela inicial escura](evidences/01-dark-empty-desktop.png) |
| CA-02 | Alternar muda toda a interface sem recarregar ou navegar. | TI-01, TI-03, E2E-02 | PASSOU | [resultado claro](evidences/10-weather-result-light-final.png), [resultado escuro](evidences/09-weather-result-dark-final.png) |
| CA-03 | A troca mantém o conteúdo e o estado atuais. | TI-01, TI-04, E2E-02 | PASSOU | [resultado meteorológico](evidences/09-weather-result-dark-final.png), [resultado após a troca](evidences/10-weather-result-light-final.png) |
| CA-04 | A escolha manual permanece após recarregar a mesma aba. | TU-02, E2E-01 | PASSOU | [tela clara](evidences/02-light-empty-desktop.png); reload retornou `navigationType=reload` e manteve `light` |
| CA-05 | Uma aba aberta após fechar a aba anterior começa escura. | TU-01, E2E-01 | PASSOU | [tela escura](evidences/01-dark-empty-desktop.png); a nova aba tinha `sessionStorage` vazio e iniciou escura |
| CA-06 | Enter e Espaço alternam o tema e mantêm o foco. | TI-02, E2E-01 | PASSOU | [foco de teclado](evidences/03-keyboard-focus.png) |
| CA-07 | O botão anuncia sua função e o tema ativo. | TI-01, TI-02 | PASSOU | Snapshot acessível: botão “Alternar tema”, `aria-pressed` verdadeiro no escuro e falso no claro; [evidência visual](evidences/03-keyboard-focus.png) |
| CA-08 | Textos, controles e indicadores permanecem distinguíveis nos dois temas. | TI-03, E2E-02 | PASSOU | [resultado claro](evidences/10-weather-result-light-final.png), [resultado escuro](evidences/09-weather-result-dark-final.png), [erro de validação](evidences/08-dark-error-feedback.png) |
| CA-09 | Alternar não depende da API nem gera novas chamadas meteorológicas. | TI-04, E2E-02 | PASSOU | A busca gerou um GET de localidades e um POST de previsão; o total permaneceu em 2 após alternar. |

## Testes E2E executados

| ID | Fluxo | Resultado | Observações |
|---|---|---|---|
| E2E-01 | Escolher tema claro, recarregar a aba, fechá-la e abrir outra | PASSOU | O reload manteve `light`; a aba recém-aberta não tinha preferência de sessão e iniciou `dark`. A inicialização também permaneceu escura com `prefers-color-scheme: light`. |
| E2E-02 | Buscar São Paulo, selecionar uma localidade, carregar previsão e alternar | PASSOU | A tela manteve busca, seleção, condições atuais e sete dias. O navegador registrou 2 chamadas meteorológicas antes e depois da troca. |

## Testes automatizados e cobertura

| Camada | ID | Resultado | Validação/comando | Observações |
|---|---|---|---|---|
| Unidade | TU-01 | PASSOU | `npm run test:coverage` | Navegação nova ignora preferência copiada. |
| Unidade | TU-02 | PASSOU | `npm run test:coverage` | Restaura `light` ou `dark` em reload. |
| Unidade | TU-03 | PASSOU | `npm run test:coverage` | Valores inválidos e armazenamento indisponível usam o fallback escuro sem impedir a alternância. |
| Integração | TI-01 | PASSOU | `npm run test:coverage` | A raiz e o estado acessível do botão acompanham a troca. |
| Integração | TI-02 | PASSOU | `npm run test:coverage` | Enter e Espaço alternam o tema e preservam o foco. |
| Integração | TI-03 | PASSOU | `npm run test:coverage` | Feedback, formulário, controles, previsão e atribuições usam tokens dos temas. |
| Integração | TI-04 | PASSOU | `npm run test:coverage` | A troca não remonta a tela nem repete chamadas meteorológicas. |

- Suíte: 25 arquivos e 56 testes passaram.
- Statements: 98,29% (meta: 80%).
- Branches: 91,25% (meta: 80%).
- Funções: 98,66% (meta: 80%).
- Linhas: 99,47% (meta: 80%).
- ESLint: passou sem erros; permaneceu um aviso em `src/components/ui/button.tsx`, arquivo não alterado nesta funcionalidade.
- TypeScript: `npm run typecheck` passou.
- Build: `npm run build` passou.
- Console do navegador: zero erros e zero avisos.

## Acessibilidade e responsividade

- Tab alcança o link de salto, o botão de tema e o campo Cidade nessa ordem. O botão mostra contorno sólido de 4 px quando recebe foco.
- Enter alternou `aria-pressed` de verdadeiro para falso; Espaço retornou para verdadeiro. Escape não ativou o botão.
- O nome acessível permaneceu “Alternar tema”; os ícones estão ocultos da árvore acessível. O campo Cidade tem rótulo associado e feedback inválido usa `role="alert"`.
- Contraste calculado para texto comum: corpo 19,06:1 no escuro e 19,90:1 no claro; texto secundário 8,19:1 no escuro e 5,61:1 no claro. O cartão de clima com gradiente manteve texto claro legível nos dois temas.
- A 390 × 844 px, a largura do conteúdo foi 375 px, sem rolagem horizontal. Também foram inspecionadas capturas desktop a 1200 px.
- Não há imagens de conteúdo nesta tela; portanto, texto alternativo não se aplica. Os ícones funcionais têm texto ou estado acessível associado.
- Estados vazios, de erro e com previsão foram capturados em [evidências](evidences/).

## Bugs encontrados e corrigidos

| ID | Descrição | Severidade | Status | Correção | Teste de regressão | Evidência |
|---|---|---|---|---|---|---|
| BUG-01 | O token `muted-foreground` no tema claro apresentava contraste de 4,35:1 sobre fundo branco, abaixo de 4,5:1. | Baixa | Corrigido | Ajustado de `240 3.8% 46.1%` para `240 3.8% 42%`; o contraste medido passou a 5,61:1. | `src/index.css.test.ts` calcula o contraste dos tokens claros e escuros e exige pelo menos 4,5:1. | [interface clara final](evidences/02-light-empty-desktop.png) |

## Ambiente de validação

- Backend: `http://localhost:3000` (`PORT=3000`).
- Frontend: `http://localhost:5100` com `VITE_API_BASE_URL=http://localhost:3000`.
- Os dois processos iniciados para esta validação foram encerrados com SIGINT; confirmei que as portas 3000 e 5100 ficaram livres.

## Conclusão

Todos os critérios de aceitação foram atendidos. A preferência dura somente na aba atual, as duas apresentações mantêm contraste suficiente e alternar o tema preserva a interação meteorológica sem gerar chamadas adicionais. QA aprovado.
