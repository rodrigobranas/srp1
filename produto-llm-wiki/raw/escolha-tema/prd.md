# Documento de Requisitos do Produto (PRD)

## Visão geral

A funcionalidade permitirá que visitantes do frontend alternem entre os temas claro e escuro por meio de um botão no cabeçalho. A mudança deverá ser aplicada imediatamente, sem recarregar ou sair da tela, para que cada pessoa possa escolher a apresentação mais confortável durante o uso.

A primeira abertura em uma aba começará sempre no tema escuro. Se a pessoa alternar o tema, a escolha será mantida enquanto aquela aba permanecer aberta, inclusive após recarregar a página. Ao fechar a aba, a escolha temporária será descartada. Todo o escopo desta funcionalidade pertence ao frontend.

## Objetivos

- Permitir alternar entre os temas claro e escuro com uma ativação do botão, sem recarregar ou navegar para outra tela.
- Aplicar o tema escolhido a toda a interface visível, preservando a leitura de textos, controles e indicadores nos dois temas.
- Iniciar 100% das novas abas no tema escuro, independentemente da preferência de tema do sistema operacional.
- Manter a escolha manual durante toda a vida da aba atual, inclusive após recarregar a página, e descartá-la quando a aba for fechada.
- Considerar a funcionalidade aceita quando todos os critérios de aceitação forem atendidos, incluindo operação por teclado e anúncio acessível do controle.

## Histórias de usuário

- US1: Como visitante, quero alternar entre os temas claro e escuro para usar a interface na apresentação que prefiro.
- US2: Como visitante, quero que a troca aconteça sem recarregar a página para continuar no mesmo fluxo e manter o estado atual da tela.
- US3: Como visitante, quero que minha escolha dure enquanto a aba estiver aberta para não precisar repeti-la a cada uso da tela.
- US4: Como pessoa que navega por teclado ou tecnologia assistiva, quero identificar e operar o controle de tema para alternar com autonomia.

## Principais funcionalidades

### Botão de alternância

O cabeçalho apresenta um botão disponível durante o uso da interface. Ele informa a ação que será executada, como “Ativar tema claro” ou “Ativar tema escuro”, e pode ser usado por mouse, toque ou teclado.

- RF1: O frontend deve exibir no cabeçalho um botão para alternar entre os temas claro e escuro.
- RF2: Cada ativação do botão deve aplicar o tema oposto à interface atual sem recarregar a página ou alterar a navegação.
- RF3: O botão deve identificar de forma acessível a ação disponível e seu estado, sem depender apenas de um ícone ou de uma diferença de cor.

### Tema inicial e duração da escolha

Uma nova aba inicia no tema escuro. A alternância manual permanece válida durante aquela aba, inclusive após uma atualização da página, e termina quando a aba é fechada.

- RF4: Na primeira abertura da funcionalidade em uma aba sem escolha manual ativa, o frontend deve iniciar no tema escuro.
- RF5: Após uma alternância manual, o frontend deve manter o tema selecionado na aba atual até que ela seja fechada.
- RF6: Uma nova aba deve iniciar no tema escuro, sem herdar a escolha manual feita em outra aba já aberta.

### Leitura e operação acessíveis

Os dois temas devem manter a interface legível e o botão utilizável por pessoas com diferentes formas de navegação.

- RF7: O botão deve receber foco visível e responder às teclas Enter e Espaço.
- RF8: Textos, controles e indicadores da interface devem continuar distinguíveis nos temas claro e escuro; cor ou ícone não devem ser a única forma de comunicar uma informação.

## Critérios de aceitação

- CA-01 (US1, RF1, RF4): Dada uma nova aba sem escolha manual ativa, quando a interface for aberta, então ela começa no tema escuro.
- CA-02 (US1, RF2): Dada a interface em um dos temas, quando a pessoa ativar o botão, então toda a interface visível muda para o outro tema sem recarregar a página ou navegar para outra tela.
- CA-03 (US2, RF2): Dado que a pessoa ativou o botão durante uma interação da tela, quando o tema mudar, então o estado e o conteúdo atuais da interface permanecem disponíveis.
- CA-04 (US3, RF5): Dada uma escolha manual na aba atual, quando a página for recarregada sem fechar essa aba, então o tema escolhido continua ativo.
- CA-05 (US3, RF5–RF6): Dada uma aba em que foi feita uma escolha manual, quando essa aba for fechada e a funcionalidade for aberta em uma nova aba, então a nova aba começa no tema escuro.
- CA-06 (US4, RF3, RF7): Dado que o botão recebeu foco, quando a pessoa pressionar Enter ou Espaço, então o tema alterna e o botão continua informando de forma acessível a ação disponível.
- CA-07 (US4, RF3): Dada a interface em qualquer tema, quando uma tecnologia assistiva consultar o botão, então ela consegue identificar que o controle alterna o tema e qual ação está disponível.
- CA-08 (US1, RF8): Dada a interface em cada um dos temas, quando textos, controles e indicadores forem exibidos, então continuam distinguíveis sem que a informação dependa apenas de cor ou ícone.
- CA-09 (RF2, RF5): Quando a pessoa alternar o tema, então essa funcionalidade não adiciona chamadas ao backend nem exige uma resposta da API para aplicar a mudança.

## Experiência do usuário

- Público principal: visitantes do frontend que preferem visualizar a interface em tema claro ou escuro; a funcionalidade não exige conta.
- Fluxo principal: a pessoa abre a aplicação e vê o tema escuro; ativa o botão do cabeçalho para mudar para o tema claro ou escuro; a tela atualiza imediatamente. A escolha permanece na aba atual até que ela seja fechada.
- O botão deve permanecer em uma posição previsível e fácil de encontrar no cabeçalho, em telas móveis e desktop.
- O rótulo acessível deve indicar a ação disponível, e o foco deve ser perceptível durante a navegação por teclado. Ícones podem acompanhar o rótulo, mas não substituí-lo como única forma de identificação.
- As cores de fundo, texto, controles e indicadores devem preservar leitura e distinção nos dois temas. A troca não deve ocultar conteúdo nem interromper a interação atual.

## Restrições técnicas de alto nível

- A funcionalidade deve ser implementada exclusivamente no frontend existente, sem alterações no backend ou no contrato de API.
- A troca de tema deve ocorrer sem recarregar a página ou exigir navegação.
- O tema inicial deve ser escuro; não deve ser substituído automaticamente pela preferência do sistema operacional.
- A escolha manual deve durar somente enquanto a aba atual estiver aberta e não deve ser enviada ou sincronizada com o backend.
- A experiência deve funcionar em telas móveis e desktop e manter requisitos de legibilidade e acessibilidade nos dois temas.

## Fora do escopo

- Sincronizar a escolha entre abas, sessões diferentes, dispositivos ou contas.
- Salvar uma preferência permanente no perfil da pessoa ou no backend.
- Iniciar automaticamente conforme o tema do sistema operacional.
- Oferecer temas adicionais, personalização de cores ou configuração de paletas.
- Alterar conteúdo, layout ou comportamento de funcionalidades sem relação com a apresentação visual.
