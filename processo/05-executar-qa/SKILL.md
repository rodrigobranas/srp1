---
name: executar-qa
description: "QA — valide e estabilize uma funcionalidade implementada contra o PRD, a TechSpec e as tarefas: testes de unidade, de integração e E2E com a ferramenta de navegador disponível, acessibilidade, responsividade, correção dos bugs encontrados e um relatório final com evidências. Use quando o usuário pedir para executar QA. Não use para implementar novas tarefas nem para revisar o código (executar-review)."
argument-hint: --prd nome-da-funcionalidade
---

O argumento `--prd` identifica o slug da funcionalidade. Sem argumento, localize a pasta em `./tasks/prd-*/`. Leia o `AGENTS.md` do projeto. Em `tasks/prd-[slug]/`, leia `prd.md`, `techspec.md` e `tasks.md`; gere e mantenha o `qa.md` com os defeitos, as correções, os testes de regressão e as evidências. Salve todas as evidências da ferramenta de navegador em `tasks/prd-[slug]/evidences/`.

O QA só estará **APROVADO** quando todos os critérios de aceitação do PRD tiverem sido verificados e estiverem atendidos. Se encontrar bugs, corrija-os na causa raiz, crie testes de regressão e repita a validação. Para os fluxos de interface, use a ferramenta de navegador disponível no ambiente, como Playwright MCP, Vercel Agent Browser ou outra ferramenta equivalente.

## Fluxo

1. **Analisar** — leia o `AGENTS.md`, todas as rules em `.agents/rules/`, o PRD, a TechSpec e cada arquivo de tarefa; monte um checklist com um item de verificação por critério de aceitação (`CA-*`) e associe os casos de teste correspondentes (`TU-*`, `TI-*` e `E2E-*`).
   **Conclua quando:** houver um item de verificação e pelo menos um caso de teste associado a cada critério de aceitação do PRD.

2. **Preparar o ambiente** — suba os serviços necessários para a validação em um ambiente isolado da worktree. Use uma porta disponível na faixa `30**` (por exemplo, `3000–3099`) para o backend, uma porta disponível na faixa `51**` (por exemplo, `5100–5199`) para o frontend e uma faixa própria para cada banco ou serviço adicional. Verifique cada porta antes de iniciar o processo; se estiver ocupada, escolha outra dentro da faixa. Configure as URLs entre os serviços, registre as portas e os processos iniciados e abra a aplicação pela ferramenta de navegador disponível.
   **Conclua quando:** os serviços necessários responderem, a página inicial estiver carregada e as URLs e portas usadas estiverem registradas.

3. **Testar cada fluxo (E2E)** — para cada critério de aceitação com fluxo de interface, execute o caso E2E correspondente usando a ferramenta de navegador disponível e verifique o resultado esperado no estado da aplicação. Quando houver comportamento inesperado, investigue o estado da interface, as mensagens do console do navegador, as requisições e respostas da API e os logs do backend antes de registrar ou corrigir o bug. Capture uma evidência visual, salve-a em `tasks/prd-[slug]/evidences/`, marque o resultado como PASSOU ou FALHOU e registre cada falha no `qa.md`.

   **Conclua quando:** todo critério de aceitação com fluxo de interface estiver marcado como PASSOU ou FALHOU, com evidência.

4. **Executar casos de teste da TechSpec** — execute os casos de teste de unidade (`TU-*`) e de integração (`TI-*`) associados aos critérios de aceitação, quando aplicáveis, usando os comandos definidos no `AGENTS.md` e nas rules aplicáveis. Quando houver uma meta de cobertura definida pelo projeto, verifique-a usando os mecanismos disponíveis na stack e registre o resultado no `qa.md`. Registre também o resultado de cada caso no checklist e cada falha no `qa.md`.
   **Conclua quando:** todos os casos de teste de unidade e de integração associados aos critérios tiverem sido executados ou estiverem explicitamente bloqueados.

5. **Verificar acessibilidade** — em cada tela, use a ferramenta de navegador disponível para testar a navegação por teclado e verificar rótulos e semântica:
   - [ ] Navegação por teclado (Tab, Enter, Esc)
   - [ ] Elementos interativos com rótulos descritivos
   - [ ] Imagens com texto alternativo (`alt`) apropriado
   - [ ] Contraste de cores adequado
   - [ ] Formulários com rótulos associados aos campos
   - [ ] Mensagens de erro claras e acessíveis
   - [ ] Fontes com tamanho apropriado

   **Conclua quando:** cada item tiver sido verificado em cada tela.

6. **Verificar visual e responsividade** — capture as telas principais, salve-as em `tasks/prd-[slug]/evidences/`, cubra os estados (vazio, com dados e erro) e os principais pontos de quebra (breakpoints), e documente as inconsistências.
   **Conclua quando:** os principais estados e pontos de quebra estiverem capturados e as inconsistências, documentadas.

7. **Corrigir os bugs encontrados** — para cada bug registrado no `qa.md`:
   - localize e corrija a causa raiz, sem mascarar o sintoma;
   - crie um teste de regressão que falhe sem a correção;
   - registre no `qa.md` o status, a correção aplicada e o teste criado;
   - se a correção exigir alteração do PRD, da TechSpec ou do escopo, pare e solicite uma decisão ao usuário.

   **Conclua quando:** cada bug registrado no `qa.md` tiver uma correção e um teste de regressão, ou estiver explicitamente bloqueado por uma decisão do usuário.

8. **Revalidar** — repita os fluxos que falharam, execute os testes de regressão e verifique novamente os critérios de aceitação afetados. Se alguma validação falhar, volte ao passo 7.
   **Conclua quando:** todos os critérios de aceitação estiverem marcados como PASSOU, sem bugs não resolvidos.

9. **Reportar** — gere o `qa.md` seguindo `./references/TEMPLATE.md` desta skill, incluindo os bugs corrigidos, os testes de regressão e as evidências finais.
   **Conclua quando:** o `qa.md` estiver gerado conforme o template e atualizado com os resultados finais.

10. **Encerrar o ambiente** — desligue todos os serviços iniciados por esta execução, encerre os processos de forma graciosa e confirme que as portas, bancos temporários, containers e demais recursos foram liberados. Não encerre processos pertencentes a outra worktree ou ao usuário. Faça essa limpeza também se o QA for interrompido, bloqueado ou reprovado.
