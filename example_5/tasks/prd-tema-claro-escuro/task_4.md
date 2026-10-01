# Tarefa 4.0: Validar os fluxos completos em navegador

## Visão geral

Após concluir as tarefas 1.0 a 3.0, validar manualmente em navegador a duração da preferência por aba e a troca de tema durante o fluxo do painel meteorológico. Registrar resultados e evidências em `qa.md` e `evidences/`, conforme a TechSpec e o processo de QA do projeto.

## Dependências

- Tarefa 1.0 — preferência por aba implementada.
- Tarefa 2.0 — botão acessível integrado ao painel.
- Tarefa 3.0 — estilos revistos para ambos os temas.

<skills>
### Conformidade com skills

- `executar-qa` (`.agents/skills/executar-qa/SKILL.md`): seguir o processo de validação em navegador, registrar resultados e evidências e verificar os critérios do PRD.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Esta tarefa não cria testes E2E automatizados: a TechSpec define os cenários E2E como validações manuais porque não há runner configurado, e `tests.md` orienta não adicionar E2E automatizado neste momento. Usar ambiente de navegador e registrar resultado verificável para cada critério.
</rules>

<requirements>

- RF1–RF8: verificar no fluxo completo a disponibilidade, operação, persistência por aba, acessibilidade e legibilidade do tema.
- Não exigir chamadas ou alterações no backend para alternar o tema.
</requirements>

## Subtarefas

- [ ] 4.1 Preparar a aplicação e o navegador em ambiente isolado; registrar as portas e os serviços iniciados para a validação.
- [ ] 4.2 Abrir uma nova aba, selecionar o tema claro, recarregar a mesma aba e confirmar a restauração; fechar a aba e abrir ou duplicar outra para confirmar o tema escuro.
- [ ] 4.3 Durante uma busca meteorológica, alternar os temas e confirmar que a tela, os resultados e as mensagens permanecem disponíveis e legíveis, sem requisição adicional causada pela troca.
- [ ] 4.4 Reexecutar os casos de unidade e integração da TechSpec e confirmar a cobertura mínima de 80% em linhas, funções, branches e statements.
- [ ] 4.5 Conferir no navegador foco visível, teclas Enter e Espaço, nome acessível, estado anunciado, contraste e responsividade nos estados principais da tela.
- [ ] 4.6 Registrar a verificação dos critérios de aceitação, resultados e evidências visuais em `tasks/prd-tema-claro-escuro/qa.md` e `tasks/prd-tema-claro-escuro/evidences/`; encerrar os serviços iniciados.

## Detalhes de implementação

Consultar `techspec.md`, seções “Abordagem de testes”, “Riscos conhecidos” e “Monitoramento e observabilidade”. E2E-01 e E2E-02 são verificações manuais em navegador; não instalar nem configurar runner E2E como parte desta tarefa. Seguir `.agents/skills/executar-qa/references/TEMPLATE.md` para `qa.md`, confirmar em especial que nova ou duplicada aba começa escura, que a escolha sobrevive ao reload da mesma aba e que a troca não dispara operações meteorológicas. Encerrar somente os processos iniciados para esta validação.

## Critérios de aceitação relacionados

- CA-01
- CA-02
- CA-03
- CA-04
- CA-05
- CA-06
- CA-07
- CA-08
- CA-09

## Testes da tarefa

### Testes de unidade (se aplicável)

- [ ] TU-01 — Usa tema escuro em navegação nova mesmo com preferência copiada
- [ ] TU-02 — Restaura escolha válida ao recarregar a mesma aba
- [ ] TU-03 — Usa tema escuro para valor inválido ou armazenamento indisponível

### Testes de integração (se aplicável)

- [ ] TI-01 — Alterna o tema da tela do clima e o estado acessível sem recarregar
- [ ] TI-02 — Alterna tema com Enter e Espaço no botão do cabeçalho
- [ ] TI-03 — Exibe mensagens e controles nos dois temas
- [ ] TI-04 — Alternar tema não reinicia operações meteorológicas

### Testes E2E (se aplicável)

- [ ] E2E-01 — Mantém tema manual no reload e inicia escuro após fechar, abrir ou duplicar uma aba (manual)
- [ ] E2E-02 — Alterna tema durante busca e consulta resultados meteorológicos (manual)

## Arquivos relevantes

- `tasks/prd-tema-claro-escuro/prd.md`
- `tasks/prd-tema-claro-escuro/techspec.md`
- `tasks/prd-tema-claro-escuro/qa.md` (gerado durante a validação)
- `tasks/prd-tema-claro-escuro/evidences/` (evidências geradas durante a validação)
