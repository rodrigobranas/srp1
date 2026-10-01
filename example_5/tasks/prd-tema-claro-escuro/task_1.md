# Tarefa 1.0: Implementar estado de tema restrito à aba

## Visão geral

Criar a preferência de tema com padrão escuro, restauração válida somente em recarga da mesma aba e estado global React. A troca deve continuar funcional se `sessionStorage` estiver indisponível. Integrar o provedor no bootstrap sem alterar o backend.

## Dependências

- Nenhuma.

<skills>
### Conformidade com skills

- `react` (`.agents/skills/react/SKILL.md`): aplicar as convenções de Context, hooks, sincronização com APIs do navegador e organização de código React.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Manter a implementação em `frontend/`, nomes técnicos em inglês, arquivos de lógica com até 80 linhas e funções com até 30 linhas. Criar testes para cada arquivo com comportamento e preservar ao menos 80% de cobertura em linhas, funções, branches e statements.
</rules>

<requirements>

- RF4: iniciar uma nova navegação sem preferência manual no tema escuro.
- RF5: manter a escolha manual na aba atual e restaurá-la ao recarregar essa aba.
- RF6: não herdar a escolha para uma nova ou duplicada aba; usar tema escuro mesmo que o navegador copie dados de sessão.
</requirements>

## Subtarefas

- [ ] 1.1 Implementar a resolução e persistência da preferência em `sessionStorage`, aceitando apenas `light` e `dark` e restaurando valor salvo somente quando a navegação atual for uma recarga.
- [ ] 1.2 Implementar `ThemeContext` e `useTheme` para manter o estado global, alterná-lo e sincronizar a classe `dark` no elemento raiz antes da pintura.
- [ ] 1.3 Integrar `ThemeProvider` em `main.tsx`, preservar `StrictMode` e preparar o meta `theme-color` inicial que será atualizado junto ao tema.
- [ ] 1.4 Criar testes de unidade para preferência copiada em navegação nova, restauração após recarga, valor inválido e falha de acesso ao armazenamento; manter o limite de cobertura do frontend.

## Detalhes de implementação

Consultar `techspec.md`, seções “Visão dos componentes”, “Design de implementação”, “Abordagem de testes” e “Principais decisões”. Usar a classificação `reload` de Navigation Timing para decidir se uma preferência salva pode ser restaurada; erros de `sessionStorage` não devem impedir a troca na página atual.

## Critérios de aceitação relacionados

- CA-01
- CA-04
- CA-05

## Testes da tarefa

### Testes de unidade (se aplicável)

- [ ] TU-01 — Usa tema escuro em navegação nova mesmo com preferência copiada
- [ ] TU-02 — Restaura escolha válida ao recarregar a mesma aba
- [ ] TU-03 — Usa tema escuro para valor inválido ou armazenamento indisponível

### Testes de integração (se aplicável)

### Testes E2E (se aplicável)

## Arquivos relevantes

- `frontend/src/lib/theme-preference.ts` (novo)
- `frontend/src/lib/theme-preference.test.ts` (novo)
- `frontend/src/contexts/ThemeContext.tsx` (novo)
- `frontend/src/contexts/ThemeContext.test.tsx` (novo)
- `frontend/src/main.tsx`
- `frontend/index.html`
- `frontend/src/index.css` (tokens existentes consumidos pelo tema)
- `frontend/package.json` e `frontend/vite.config.ts` (referência à infraestrutura existente de testes e cobertura)
