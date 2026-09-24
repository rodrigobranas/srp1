AGENTS.md

crie um AGENTS.md e inclua algumas informações relevantes:

1 - documente que existem dois projetos nas pastas frontend e backend e seu propósito
2 - deixe claro qual é a tecnologia de cada um deles
3 - liste os comandos utilizados para instalar dependências, rodar testes e executar o projeto
4 - quais são as portas utilizadas por cada projeto
5 - as dependências de cada um, por exemplo, banco de dados, serviços externos

code-standards.md

crie em .agents/rules/code-standards.md os padrões de codificação deste projeto. Faça em português e dê exemplos de utilização de cada regra. Vincule essa regra no AGENTS.md

1 - todo o código deve ser escrito em inglês
2 - os arquivos (classes, interfaces, componentes) não devem ter mais de 80 linhas
3 - os métodos e funções não devem ter mais de 30 linhas
4 - evite passar mais de 3 parâmetros (prefira objetos)
5 - não aninhe mais de 2 if/else
6 - utilize early returns (cláusulas-guarda) para evitar o uso de else se for necessário
7 - declare as variáveis próximas ao local de utilização
8 - não use linhas em branco dentro de métodos e funções

folder-structure.md

crie em .agents/rules/folder-structure.md deste projeto. Faça em português e dê exemplos de utilização de cada regra. Vincule essa regra no AGENTS.md

1 - para o frontend, que use React, defina: views, components, hooks, types, assets, services
2 - para o backend, que use Node.js, defina: routes, services, data (para banco de dados), gateway (para integração com APIs externas), types

react.md

crie em .agents/rules/react.md deste projeto. Faça em português e dê exemplos de utilização de cada regra. Vincule essa regra no AGENTS.md

1 - use tailwind para a estilização dos componentes
2 - não crie componentes com mais de 30 linhas (faça a decomposição em componentes menores)
3 - evite passar props usando spread operator (<element ...props>)
4 - não abuse de useEffect
5 - use useMemo para evitar cálculos no re-render
6 - extraia lógica compartilhada específica para hooks

tests.md

crie em .agents/rules/tests.md deste projeto. Faça em português e dê exemplos de utilização de cada regra. Vincule essa regra no AGENTS.md

1 - SEMPRE CRIE TESTES PARA TUDO QUE FOR IMPLEMENTADO
2 - tenha uma cobertura mínima de 80% (code coverage)
3 - não crie testes acoplados uns nos outros, faça com que eles sejam independentes
4 - utilize testes de unidade e integração
5 - prefira o uso de mock e stub quando for necessário para que o teste seja repetível
6 - estrutura os testes usando given/when/then ou arrange/act/assert
7 - os testes devem ter objetivos de negócio
