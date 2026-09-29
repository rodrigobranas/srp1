---
name: executar-task
description: Tarefa — identifique e implemente a próxima tarefa de uma funcionalidade a partir do PRD, da TechSpec e do tasks.md, marcando-a como concluída ao final. Use quando o usuário pedir para executar, implementar ou começar uma tarefa/subtarefa, ou dar continuidade à implementação de uma funcionalidade. Não use para revisar (executar-review) nem validar em QA (executar-qa) o que já foi implementado.
argument-hint: --prd nome-da-funcionalidade
---

O argumento `--prd` identifica o slug da funcionalidade. Sem argumento, localize a pasta em `./tasks/prd-*/`. Os arquivos obrigatórios em `tasks/prd-[slug]/` são `prd.md`, `techspec.md` e `tasks.md`; se algum estiver ausente, pare e indique a skill correspondente (`/criar-prd`, `/criar-techspec` ou `/criar-tasks`).

Uma tarefa é uma **entrega incremental**, com dependências explícitas e testes próprios. Implemente todas as subtarefas e passe do plano à implementação assim que a abordagem estiver clara. Referencie o `techspec.md` em vez de repetir detalhes de implementação.

## Fluxo

1. **Selecionar a tarefa** — identifique a próxima tarefa não concluída no `tasks.md`; abra o arquivo `task_[num].md` correspondente e leia sua definição, subtarefas (`[num].1`, `[num].2`…), critérios de aceitação relacionados e testes.
   **Conclua quando:** a próxima tarefa e todas as suas subtarefas estiverem identificadas.

2. **Preparar** — leia o `AGENTS.md` e todas as rules em `.agents/rules/`; revise o contexto do PRD e os requisitos da TechSpec para a tarefa; entenda as dependências de tarefas anteriores; carregue somente as skills aplicáveis do projeto em `.agents/skills/` e consulte na web a documentação das bibliotecas envolvidas quando necessário.
   Quando a tarefa exigir a execução da aplicação, prepare um ambiente isolado para a worktree: use uma porta disponível na faixa `30**` (por exemplo, `3000–3099`) para o backend, uma porta disponível na faixa `51**` (por exemplo, `5100–5199`) para o frontend e uma faixa própria para cada banco ou serviço adicional. Verifique cada porta antes de iniciar o processo; se estiver ocupada, escolha outra dentro da faixa. Configure as URLs entre os serviços, registre as portas e os processos iniciados e suba somente os serviços necessários.
   **Conclua quando:** a abordagem estiver clara, o `AGENTS.md` e todas as rules tiverem sido consultados, as skills aplicáveis estiverem carregadas e os serviços necessários estiverem disponíveis.

3. **Implementar** — implemente cada subtarefa na ordem; ao final, execute as validações e os testes da tarefa usando os comandos definidos no `AGENTS.md` e nas rules aplicáveis.
   **Conclua quando:** toda subtarefa estiver implementada e as validações e os testes aplicáveis da tarefa passarem.

4. **Concluir e limpar** — marque como concluídas (`[x]`) todas as subtarefas e os testes aplicáveis no arquivo `task_[num].md`. Depois, marque a tarefa como concluída (`[x]`) no `tasks.md`, informe, em uma linha, o que foi implementado e desligue todos os serviços iniciados por esta execução. Encerre os processos de forma graciosa, confirme que as portas foram liberadas e não encerre processos pertencentes a outra worktree ou ao usuário. Faça essa limpeza também se a execução for interrompida ou bloqueada.
   **Conclua quando:** todas as subtarefas e os testes aplicáveis estiverem marcados no arquivo da tarefa, e a tarefa estiver marcada como concluída no `tasks.md`.
