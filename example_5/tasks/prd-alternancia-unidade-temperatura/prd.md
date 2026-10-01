# Documento de Requisitos do Produto (PRD)

## Visão geral

A funcionalidade permitirá que visitantes alternem a exibição das temperaturas do painel de clima entre Celsius e Fahrenheit por meio de um botão no topo da interface. A unidade escolhida será aplicada à temperatura atual, à sensação térmica e às temperaturas mínima e máxima da previsão de sete dias, com o símbolo da unidade visível junto a cada valor.

A troca deverá atualizar a apresentação dos dados já carregados sem recarregar a página ou fazer uma nova consulta meteorológica. Celsius continuará sendo a unidade inicial. A escolha permanecerá enquanto a página atual estiver carregada, inclusive durante novas pesquisas; recarregar a página ou iniciar uma nova visita reinicia a unidade em Celsius.

## Objetivos

- Permitir alternar entre Celsius e Fahrenheit com uma ativação do botão, atualizando os valores exibidos em até um segundo e sem interromper a consulta atual.
- Exibir em 100% dos resultados a unidade selecionada em todas as temperaturas: condição atual, sensação térmica e mínimas e máximas diárias.
- Converter os valores com a relação correta entre as escalas e voltar a apresentar os valores Celsius originais quando essa unidade for selecionada novamente.
- Iniciar 100% das novas visitas e recargas em Celsius e manter a escolha feita durante a página atual, inclusive após a consulta de outra cidade.
- Exibir temperaturas em português brasileiro, com até uma casa decimal e sem zeros finais desnecessários.
- Não gerar uma nova requisição meteorológica ao alternar unidades.

## Histórias de usuário

- US1: Como visitante, quero alternar entre Celsius e Fahrenheit para consultar as temperaturas na unidade que prefiro.
- US2: Como visitante, quero ver o símbolo da unidade junto a cada temperatura para entender os valores sem ambiguidade.
- US3: Como visitante, quero manter a unidade escolhida ao pesquisar outra cidade para comparar os resultados com consistência.
- US4: Como pessoa que navega por teclado ou tecnologia assistiva, quero identificar e operar o controle de unidade para alternar com autonomia.

## Principais funcionalidades

### Botão de alternância de unidade

O topo do painel apresentará um botão fácil de localizar que alterna entre Celsius e Fahrenheit. O botão indicará a unidade ativa, e seu nome acessível informará a ação disponível.

- RF1: O painel deve exibir no topo um botão para alternar entre Celsius e Fahrenheit.
- RF2: O botão deve indicar a unidade ativa e identificar de forma acessível a unidade para a qual a ação irá alternar.
- RF3: Cada ativação deve atualizar a unidade de todas as temperaturas visíveis sem recarregar a página ou interromper a navegação atual.

### Conversão e apresentação das temperaturas

As temperaturas atuais e previstas serão apresentadas na unidade selecionada. A umidade, a velocidade do vento, as condições meteorológicas e os demais dados não relacionados à temperatura manterão as unidades e os valores atuais.

- RF4: O frontend deve converter a temperatura atual, a sensação térmica e as temperaturas mínima e máxima de cada dia exibido para a unidade selecionada.
- RF5: A conversão entre Celsius e Fahrenheit deve seguir as relações exatas reconhecidas pelo NIST: °F = (°C × 1,8) + 32 e °C = (°F − 32) ÷ 1,8. [NIST — equações de conversão de temperatura](https://www.nist.gov/system/files/documents/2019/11/19/00-20-hb44-final11152019pdf.pdf).
- RF6: Cada temperatura deve exibir explicitamente °C ou °F de acordo com a unidade selecionada, inclusive os valores de mínima e máxima da previsão.
- RF7: Valores de temperatura indisponíveis devem continuar identificados como indisponíveis e não devem ser exibidos como valores numéricos inválidos após a troca.
- RF8: Quando Celsius voltar a ser selecionado, o painel deve apresentar os valores Celsius originais da resposta meteorológica, sem acumular arredondamentos de conversões anteriores.

### Duração da escolha

A unidade selecionada valerá enquanto a página atual estiver carregada e será mantida ao consultar outras cidades. Recarregar a página ou iniciar uma nova visita começará em Celsius.

- RF9: O painel deve iniciar em Celsius ao abrir uma nova visita ou recarregar a página.
- RF10: O painel deve manter a unidade selecionada ao realizar novas consultas enquanto a aba atual estiver aberta.
- RF11: A preferência não deve ser sincronizada entre visitas, contas ou dispositivos.
- RF12: Alternar a unidade não deve iniciar uma nova consulta de clima nem exigir uma resposta do backend.
- RF13: Os valores devem usar formatação pt-BR com até uma casa decimal e sem zeros finais desnecessários.

## Critérios de aceitação

- CA-01 (US1, RF1, RF9): Dada uma nova visita ou recarga da página, quando a interface for aberta, então o controle e todas as temperaturas disponíveis indicam Celsius.
- CA-02 (US1, RF3–RF6): Dado um resultado meteorológico carregado em Celsius, quando a pessoa ativar o botão para Fahrenheit, então a temperatura atual, a sensação térmica e as mínimas e máximas dos sete dias passam a ser exibidas em Fahrenheit com o símbolo °F.
- CA-03 (US1, RF5): Dada uma temperatura de 0 °C, quando o painel for alternado para Fahrenheit, então o valor exibido será 32 °F; dada uma temperatura de 100 °C, então o valor exibido será 212 °F.
- CA-04 (US1, RF3, RF8): Dada a interface em Fahrenheit, quando a pessoa voltar para Celsius, então o painel exibirá os mesmos valores Celsius recebidos originalmente, sem erro acumulado pela alternância.
- CA-05 (US2, RF4, RF6): Dado qualquer resultado exibido, quando a unidade for alternada, então todos os campos de temperatura — inclusive a sensação térmica e cada mínima e máxima — mostram a unidade escolhida; umidade e vento mantêm seus valores e unidades atuais.
- CA-06 (RF7): Dado um campo de temperatura indisponível, quando a unidade for alternada, então o campo continua identificado como indisponível e não apresenta `NaN`, infinito ou outro valor inválido.
- CA-07 (US3, RF10–RF12): Dada a unidade Fahrenheit selecionada, quando a pessoa consultar outra cidade na mesma aba, então os novos valores continuam em Fahrenheit; a troca não dispara uma nova consulta meteorológica além daquela iniciada pela busca.
- CA-08 (US3, RF9, RF11): Dado Fahrenheit selecionado, quando a pessoa recarregar a página ou iniciar uma nova visita, então a unidade inicial será Celsius.
- CA-09 (US4, RF2–RF3): Dado que o botão recebeu foco, quando a pessoa o acionar por teclado, então a unidade alterna e o controle comunica de forma acessível a unidade ativa e a ação disponível.
- CA-10 (RF12): Dado um resultado meteorológico já carregado, quando a unidade for alternada, então a mudança aparece em até um segundo sem recarregar a página nem realizar uma chamada adicional ao backend.
- CA-11 (US2, RF5, RF13): Dada a temperatura de 23,4 °C, quando for exibida em Fahrenheit, então aparece como 74,1 °F; dada a temperatura de 25 °C, então aparece como 77 °F, sem zero decimal final.

## Experiência do usuário

- Público principal: visitantes do painel de clima que preferem consultar temperaturas em Celsius ou Fahrenheit; a funcionalidade não exige conta.
- Fluxo principal: a pessoa abre o painel em Celsius, consulta uma cidade, ativa o botão no topo para alternar a unidade e vê os valores e símbolos atualizados. Se pesquisar outra cidade na mesma aba, a unidade escolhida continua ativa.
- O botão deve ficar no topo da interface, em posição visível em telas móveis e desktop. O estado atual e a ação disponível devem ser compreensíveis sem depender apenas de cor ou ícone.
- A unidade deve ser exibida junto a cada temperatura, inclusive nas temperaturas mínima e máxima de cada dia e na sensação térmica.
- O botão deve ter rótulo acessível, foco visível e operação por teclado. Mensagens ou atualizações relevantes devem permanecer perceptíveis para tecnologias assistivas.
- A apresentação numérica deve usar formatação pt-BR, com até uma casa decimal e sem zeros finais desnecessários.

## Restrições técnicas de alto nível

- A funcionalidade pertence ao frontend e deve usar os dados meteorológicos já carregados, cuja unidade de temperatura é Celsius.
- A alternância deve ser local à experiência de exibição; não requer mudança no backend, no contrato da API ou nos provedores meteorológicos.
- Não deve haver nova chamada de rede para converter ou reapresentar as temperaturas.
- A unidade e o símbolo correspondentes devem ser apresentados em celulares e desktops, com operação acessível por teclado e tecnologia assistiva.
- As equações de conversão devem seguir a referência do NIST indicada em RF5.

## Fora do escopo

- Alterar a unidade solicitada ou recebida pela API, modificar o backend ou adicionar provedores meteorológicos.
- Converter unidades de umidade, velocidade do vento, pressão ou qualquer medida que não seja temperatura.
- Salvar a preferência entre visitas, sincronizá-la entre abas, contas ou dispositivos, ou adicionar configuração de perfil.
- Incluir outras escalas de temperatura além de Celsius e Fahrenheit.
- Alterar previsões, regras de busca de cidades, descrições meteorológicas ou o conteúdo do painel que não dependa da unidade de temperatura.
