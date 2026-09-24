crie um arquivo chamado AGENTS.md e inclua:

* Documento que existem dois projetos, frontend e backend (cada um na sua pasta) e o propósito de cada um deles. Reforce que todo o código deve sempre ser criado dentro dessas pastas conforme a responsabilidade. 
* Deixe claro qual é a tecnologia adotada por cada um deles.
* Liste e documente os comandos em cada um deles para fazer a instalação de novas bibliotecas, para rodar os testes, para rodar o projeto, para fazer o build, etc
* Cite as portas onde cada projeto roda
* Cite as dependências de cada um dos projetos, APIs externas, banco de dados (se existir), etc

crie um arquivo chamado code-standards.md em .agents/rules/, em português, dando exemplo para cada regra e vincule no AGENTS.md, criando uma referência

* Todo o código deve ser escrito em inglês
* Os arquivos (como classes, interfaces), devem ter no máximo 80 linhas
* Os métodos não devem ter mais de 30 linhas
* Evite passar mais de 3 parâmetros para as funções ou métodos, dê preferência a objeto parâmetro
* Não aninhe mais de 3 if/else
* Use early returns (cláusulas-guarda), para evitar o uso desnecessário de else
* Declare as variáveis o mais próximas possível do local de utilização
* Não use linhas em branco dentro de funções e métodos, dê preferência para extrair novas funções e métodos quando sentir vontade de dar uma linha em branco para trazer clareza e separação de responsabilidades
* Sempre use ; no final dos statements que demandarem
* Use import/export ao invés de require para usar bibliotecas

folder-structure.md

crie em .agents/rules/folder-structure.md, faça em português, dê exemplos e vincule no AGENTS.md

* para o frontend, que usa React, siga: views (para as telas), components (para componentes independentes ou que façam parte das telas), types (tipos), assets (estáticos), services (código reusável ou específico de um componente) colocando os arquivos referentes as responsabilidades em cada uma das pastas. verifique se conforme o padrão do React está faltando alguma pasta relevante
* para o backend, que usa Node.js, siga: routes (que vai ter a responsabilidade de lidar com req/res http), services (para agrupar as regras de negócio), data (para banco de dados e queries), gateway (para interação com APIs externas), types (para a tipagem)

react.md

crie um arquivo de regras em .agents/rules/react.md, em português, dê exemplos e vincule no AGENTS.md

* use tailwind para a estilização dos componentes
* não crie componentes com mais de 30 linhas
* evite passar props usando spread operator <element ...props>
* não exegere no uso de useEffect
* prefira useMemo para evitar re-render desnecessário com cálculo pesados
* extraia lógica de componentes para hooks ou services conforme necessário

tests.md

crie um arquivo de regras em .agents/rules/tests.md, em português, dê exemplos e vincule no AGENTS.md

* <critical>**SEMPRE CRIE TESTES PARA TODOS OS ARQUIVOS E COMPONENTES**</critical> (seguindo as responsabilidades)
* adote uma cobertura mínima de 80% de testes
* não crie testes acoplados e dependentes, os testes devem rodar de forma independente
* utilize testes de unidade e integração (por enquanto não use testes E2E)
* prefira o uso de test patterns como mock e stub para comportamento que depende de fatores externos (APIs e banco de dados)
* estruture os testes com o padrão given/when/then
* os testes sempre devem ter objetivos claros de negócio
