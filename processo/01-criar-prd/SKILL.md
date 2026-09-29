---
name: criar-prd
description: PRD — Documento de Requisitos de Produto. Use quando o usuário pedir um PRD ou quiser definir os requisitos e o escopo de uma nova funcionalidade ou produto (primeira etapa do fluxo PRD → TechSpec → tasks). Não use para especificações técnicas (criar-techspec) nem para decompor requisitos em tarefas (criar-tasks).
argument-hint: --prompt "descrição da funcionalidade"
---

O PRD define o problema, os objetivos, os resultados esperados, as restrições e o escopo. Objetivos e resultados devem ter critérios mensuráveis. Os detalhes de implementação — como arquitetura e código — pertencem à TechSpec e ficam fora do PRD.

## Fluxo de trabalho

1. **Esclarecer** — faça perguntas ao usuário usando `AskUserQuestion` antes de redigir:
   - Problema a ser resolvido e metas mensuráveis
   - Usuários principais, histórias de usuário e fluxos principais
   - Funcionalidades centrais: entradas, saídas e ações
   - Itens fora do escopo e dependências
   - Diretrizes de UI/UX e acessibilidade

   Para regras de negócio específicas do domínio, pesquise na web em vez de perguntar ao usuário.
   **Conclua quando:** cada seção do template tiver uma resposta ou premissa registrada.

2. **Redigir** — leia `./references/TEMPLATE.md` desta skill na íntegra e siga sua estrutura exatamente.
   **Conclua quando:** toda seção do template estiver preenchida com informações específicas da funcionalidade ou do produto.

3. **Salvar e reportar** — grave o documento em `./tasks/prd-[slug]/prd.md`, usando um slug da funcionalidade em kebab-case. Informe o caminho com um resumo de uma linha.
