---
name: executar-review
description: Revisão de código — revise e estabilize o código de uma funcionalidade quanto à conformidade com as regras do projeto, à aderência à TechSpec e às tarefas e aos testes, com relatório final e veredito. Use quando o usuário pedir para revisar código, executar uma revisão de código, validar a conformidade com as regras ou corrigir problemas encontrados durante a revisão. Não use para validar o comportamento em QA (executar-qa) nem para implementar novas tarefas.
argument-hint: --prd nome-da-funcionalidade
---

O argumento `--prd` identifica o slug da funcionalidade. Sem argumento, localize a pasta em `./tasks/prd-*/`. Leia o `AGENTS.md` do projeto. Em `tasks/prd-[slug]/`, leia `techspec.md` e `tasks.md`; consulte `prd.md` somente quando necessário para esclarecer um requisito. Gere o `codereview.md` na mesma pasta.

Confira as regras do projeto e a TechSpec antes de apontar qualquer problema. Execute os testes e as validações exigidos no `AGENTS.md` antes de registrar o veredito; a revisão só poderá ser **APROVADA** quando todos os testes aplicáveis passarem.

## Fluxo

1. **Analisar** — leia o `AGENTS.md`, todas as rules em `.agents/rules/`, a TechSpec (arquitetura esperada) e as tarefas (escopo implementado). Carregue somente as skills aplicáveis do projeto em `.agents/skills/`.
   **Conclua quando:** a arquitetura esperada, o escopo, as rules e as skills aplicáveis estiverem claros.

2. **Conformidade com as regras** — confira cada mudança contra as regras aplicáveis do projeto em `.agents/rules/`. Registre cada violação e a regra correspondente.
   **Conclua quando:** cada mudança tiver sido conferida contra as regras aplicáveis.

3. **Aderência à TechSpec** — compare a implementação com o especificado:
   - [ ] Arquitetura conforme especificado
   - [ ] Componentes, interfaces e contratos conforme definidos
   - [ ] Modelos de dados conforme documentados
   - [ ] Endpoints/APIs e integrações, quando aplicáveis, conforme especificados

   **Conclua quando:** cada decisão da TechSpec tiver sido confirmada como implementada ou registrada como desvio justificado.

4. **Completude das tarefas** — para cada tarefa marcada como completa, verifique se o código foi implementado, os critérios de aceitação relacionados estão rastreados, as subtarefas foram concluídas e os testes da tarefa estão presentes. A validação funcional dos critérios continua sendo responsabilidade do QA.
   **Conclua quando:** cada tarefa marcada como completa atender aos quatro pontos.

5. **Testes** — leia os comandos de teste, validação, build e cobertura definidos no `AGENTS.md` e execute os comandos aplicáveis dentro de cada aplicativo afetado. Se algum comando exigir a aplicação em execução, prepare um ambiente isolado para a worktree: use uma porta disponível na faixa `30**` (por exemplo, `3000–3099`) para o backend, uma porta disponível na faixa `51**` (por exemplo, `5100–5199`) para o frontend e uma faixa própria para cada banco ou serviço adicional. Verifique cada porta antes de iniciar o processo; se estiver ocupada, escolha outra dentro da faixa. Configure as URLs entre os serviços, registre as portas e os processos iniciados e não presuma comandos ou ferramentas que não estejam definidos no projeto.
   **Conclua quando:** todos os comandos aplicáveis definidos no `AGENTS.md` tiverem sido executados, com testes passando e a cobertura mínima respeitada quando aplicável.

6. **Corrigir e revalidar** — para cada problema encontrado:
   - corrija a causa raiz e ajuste ou crie os testes necessários;
   - se a correção exigir alteração do PRD, da TechSpec ou do escopo, registre o problema como bloqueador e solicite uma decisão ao usuário;
   - execute novamente os testes e repita as verificações relevantes.

   **Conclua quando:** não houver problemas bloqueadores e os testes e as verificações relevantes tiverem sido executados novamente.

7. **Reportar** — gere o `codereview.md` seguindo `./references/TEMPLATE.md` desta skill, com o veredito:
   - **APROVADO** — critérios atendidos, testes passando, código conforme as regras e a TechSpec.
   - **APROVADO COM RESSALVAS** — principais critérios atendidos; melhorias recomendadas, mas não bloqueantes.
   - **REPROVADO** — testes falhando, violação grave de padrão, falta de aderência à TechSpec ou problema de segurança.

   **Conclua quando:** o `codereview.md` estiver salvo conforme o template, com o veredito registrado.

8. **Encerrar o ambiente** — desligue todos os serviços iniciados por esta execução, encerre os processos de forma graciosa e confirme que as portas, bancos temporários, containers e demais recursos foram liberados. Não encerre processos pertencentes a outra worktree ou ao usuário. Faça essa limpeza também se a revisão for interrompida, bloqueada ou reprovada.
