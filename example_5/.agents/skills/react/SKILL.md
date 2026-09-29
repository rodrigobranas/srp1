---
name: react
description: Create or modify React components, hooks, and screens in frontend/ using this project's React conventions.
---

# React

Use esta skill sempre que for necessário criar, alterar, revisar ou interagir com componentes React, hooks customizados ou telas em `frontend/`.

## Diretrizes

- Estilize componentes com classes utilitárias do Tailwind diretamente no JSX. Não crie CSS por componente, estilos inline ou outra biblioteca de estilização sem necessidade técnica documentada.
- Mantenha cada componente React em até 30 linhas. Extraia partes visuais em componentes focados e separe lógica em hooks ou services.
- Declare explicitamente as props aceitas. Não repasse props com spread diretamente para elementos ou componentes.
- Use `useEffect` apenas para sincronizar o React com algo externo, como APIs do navegador, subscrições, timers ou o título da página. Calcule valores derivados durante a renderização; trate eventos em handlers; mantenha busca de dados e fluxo de estado em hooks dedicados.
- Use `useMemo` somente para cálculos comprovadamente custosos, como filtros, ordenações ou agregações de coleções grandes. Ele memoriza o resultado, mas não evita renderizações.
- Coloque estado, ciclo de vida e demais APIs do React em hooks. Coloque comunicação com APIs, transformação de dados e tarefas independentes do React em services. Componentes devem coordenar esses elementos e renderizar a interface.

## Referências

- Para estilos Tailwind e contratos explícitos de props, leia [references/styling-and-props.md](references/styling-and-props.md).
- Para dividir componentes e separar responsabilidades entre view, componentes, hooks e services, leia [references/component-composition.md](references/component-composition.md).
- Para decidir entre renderização, handlers, `useEffect` e `useMemo`, leia [references/react-hooks.md](references/react-hooks.md).
