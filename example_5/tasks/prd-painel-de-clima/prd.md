# Documento de Requisitos do Produto (PRD)

## Visão geral

O painel de clima permitirá que visitantes do frontend existente consultem as condições atuais de uma cidade sem sair da aplicação. A busca principal será feita pelo nome da cidade; quando houver localidades com nomes iguais, o usuário poderá distinguir os resultados pela região e pelo país.

O painel exibirá as condições atuais e a previsão diária para hoje e os seis dias seguintes. A consulta atual incluirá temperatura em Celsius, descrição das condições do tempo, sensação térmica, umidade, vento e horário local; cada data da previsão exibirá a condição esperada e as temperaturas mínima e máxima. O backend existente será o único intermediário entre o frontend e as APIs da Open-Meteo. A localização pelo navegador poderá ser oferecida como atalho opcional, sempre com ação e permissão do usuário.

## Objetivos

- Permitir que o usuário conclua uma consulta válida e veja o clima atual e a previsão diária de sete datas para a cidade em um único fluxo.
- Exibir localização, temperatura atual, condição do tempo, sensação térmica, umidade, vento e horário local dos dados atuais.
- Exibir, para hoje e os seis dias seguintes, a data local, condição do tempo e temperaturas mínima e máxima.
- Como meta de experiência, mostrar os dados em até 5 segundos em pelo menos 95% das consultas válidas quando as APIs externas estiverem disponíveis.
- Apresentar uma mensagem clara em 100% dos casos de entrada vazia, localidade não encontrada ou indisponibilidade dos dados, preservando a possibilidade de tentar novamente.
- Acompanhar como indicadores de sucesso a taxa de consultas válidas concluídas e o tempo entre o envio da busca e a exibição dos resultados.

## Histórias de usuário

- US1: Como visitante, quero pesquisar uma cidade pelo nome para ver rapidamente o clima atual e planejar meus próximos dias com a previsão local.
- US2: Como visitante, quero distinguir cidades homônimas por estado/região e país para consultar a localidade correta.
- US3: Como visitante, quero saber quando a cidade não foi encontrada ou quando os dados estão indisponíveis para poder corrigir a busca ou tentar novamente.
- US4: Como visitante que deseja um atalho, quero permitir o uso da minha localização no navegador para consultar o clima local sem digitar uma cidade.
- US5: Como usuário de teclado ou tecnologia assistiva, quero operar a busca e receber seus estados e resultados de forma acessível.

## Principais funcionalidades

### Busca e seleção da cidade

A pessoa informa o nome de uma cidade e inicia a busca. O sistema apresenta correspondências identificáveis por cidade, região e país quando houver mais de uma opção, e permite escolher a localidade desejada.

- RF1: O painel deve oferecer um campo rotulado para informar uma cidade e permitir iniciar a busca por botão ou pela tecla Enter.
- RF2: O sistema deve rejeitar entrada vazia após remover espaços excedentes e orientar o usuário a informar uma cidade.
- RF3: O usuário deve poder escolher entre resultados homônimos identificados por região e país antes de consultar o clima.

### Consulta e exibição do clima

Após identificar a localidade, o backend consulta os dados atuais e a previsão diária. O painel mostra as informações em unidades e rótulos compreensíveis para o usuário.

- RF4: O backend deve resolver o nome informado em uma localidade e consultar as condições atuais e a previsão diária para hoje e os seis dias seguintes usando a Open-Meteo.
- RF5: O frontend deve obter os dados exclusivamente do backend da aplicação; não deve consultar diretamente serviços externos de geocodificação ou clima.
- RF6: Em uma resposta bem-sucedida, o painel deve mostrar o nome da cidade e país, temperatura atual em Celsius, descrição do tempo, sensação térmica, umidade, velocidade do vento e horário local dos dados.
- RF7: O painel deve mostrar sete datas locais — hoje e os seis dias seguintes — com descrição do tempo e temperaturas mínima e máxima para cada dia.
- RF8: O painel deve identificar a Open-Meteo como fonte dos dados meteorológicos.
- RF9: O sistema deve fornecer estados de carregamento, ausência de resultados e falha de serviço, com orientação para tentar novamente quando apropriado.

### Atalho opcional de localização

A busca digitada permanece disponível como fluxo principal. Se o atalho de localização for incluído, o usuário deve iniciá-lo e conceder a permissão solicitada pelo navegador.

- RF10: O painel pode oferecer uma ação para usar a localização do navegador como sugestão ou origem da consulta local.
- RF11: O painel não deve solicitar nem usar a localização sem ação do usuário; se a permissão for negada ou a localização não estiver disponível, a busca manual deve continuar funcionando.

## Critérios de aceitação

- CA-01 (US1, RF1–RF2): Dada uma entrada vazia ou composta apenas de espaços, quando o usuário iniciar a busca, então o painel informa que uma cidade deve ser preenchida e não exibe dados antigos como resultado da nova consulta.
- CA-02 (US1, RF4–RF6): Dada uma cidade encontrada e dados meteorológicos disponíveis, quando a consulta terminar, então o painel apresenta a cidade e o país, temperatura atual em Celsius, condição do tempo, sensação térmica, umidade, vento e horário local.
- CA-03 (US1, RF4, RF7): Dada uma localidade selecionada e previsão disponível, quando o painel exibir os resultados, então apresenta hoje e os seis dias seguintes na data local da cidade, com condição do tempo e temperaturas mínima e máxima para cada dia.
- CA-04 (US2, RF3): Dada uma busca com mais de uma localidade correspondente, quando os resultados forem apresentados, então cada opção contém informação suficiente de região e país para o usuário selecionar a cidade correta.
- CA-05 (US2, RF4–RF7): Dada uma localidade selecionada, quando o clima e a previsão forem exibidos, então os dados correspondem à localidade escolhida e não a outra correspondência da busca.
- CA-06 (US3, RF9): Dada uma cidade sem correspondências, quando a busca terminar, então o painel informa que não encontrou a localidade e mantém o campo disponível para uma nova busca.
- CA-07 (US3, RF9): Dada uma falha ou demora excessiva do serviço externo, quando a consulta falhar, então o painel mostra uma mensagem compreensível e uma forma de tentar novamente, sem expor detalhes técnicos da falha.
- CA-08 (US4, RF10–RF11): Se o atalho de localização estiver disponível, dada uma ação explícita do usuário, então o navegador solicita permissão; se a pessoa negar ou a localização falhar, a busca digitada permanece disponível.
- CA-09 (RF5): Ao realizar uma busca pelo painel, então as chamadas do navegador para obter geocodificação e clima são feitas somente ao backend da aplicação.
- CA-10 (US5): O campo e as ações principais têm rótulos acessíveis, podem ser operados por teclado, mantêm foco visível e comunicam carregamento, erro e resultado a tecnologias assistivas; cor ou ícone não são a única forma de transmitir uma condição.
- CA-11 (RF8): Dado um resultado meteorológico, então a atribuição à Open-Meteo fica visível no painel.
- CA-12 (Objetivos): Em condições normais de rede e com os serviços externos disponíveis, pelo menos 95% das consultas válidas exibem os resultados em até 5 segundos após o envio da busca ou a seleção da localidade.

## Experiência do usuário

- Público principal: visitantes do frontend que precisam consultar rapidamente o clima atual e a previsão dos próximos dias de uma cidade; não é necessário ter conta.
- Fluxo principal: informar cidade, iniciar busca, escolher entre correspondências se necessário, aguardar o carregamento e consultar as condições atuais e a previsão diária. A pessoa pode então pesquisar outra cidade.
- A tela deve apresentar a busca de forma direta e adaptar-se a dispositivos móveis e desktops. A interface e as mensagens devem usar português do Brasil; temperatura em Celsius é a unidade inicial.
- A previsão deve permitir comparar os dias seguintes rapidamente, exibindo a data local, a condição e as temperaturas mínima e máxima de cada dia.
- O carregamento deve indicar que a consulta está em andamento. Erros devem explicar a próxima ação possível sem substituir uma busca válida já exibida por conteúdo quebrado.
- A interface deve ter estrutura semântica, rótulos para controles, navegação por teclado, foco perceptível, contraste adequado e mensagens de estado acessíveis.
- Se oferecida, a localização do navegador deve ser um atalho opcional com explicação clara. O usuário pode recusar e continuar pelo fluxo manual.

## Restrições técnicas de alto nível

- O frontend integra somente com o backend da aplicação para buscar localizações, condições atuais e previsão meteorológica.
- O backend integra com a Geocoding API da Open-Meteo para resolver nomes de cidades e com a Weather Forecast API para consultar dados atuais e diários. A documentação da [Geocoding API](https://open-meteo.com/en/docs/geocoding-api) descreve a busca por nome e os dados de localidade; a [Weather Forecast API](https://open-meteo.com/en/docs) descreve coordenadas, condições atuais e variáveis diárias como códigos do tempo e temperaturas mínima e máxima.
- As condições atuais da API são baseadas em dados de modelos meteorológicos, não necessariamente em leitura de uma estação local; o painel não deve sugerir precisão de observação direta. A documentação da Weather Forecast API informa que as condições atuais são baseadas em dados de modelo meteorológico de 15 minutos.
- O uso gratuito e sem chave indicado no pedido é adequado para uso não comercial, sujeito às cotas e condições publicadas pela Open-Meteo. A própria Open-Meteo informa que o nível gratuito não inclui garantia de disponibilidade e que uso comercial exige licença comercial. Validar o licenciamento antes de qualquer uso comercial. Consultar a [página de preços e condições de uso](https://open-meteo.com/en/pricing).
- A atribuição dos dados meteorológicos da Open-Meteo deve ser visível. A página de preços informa que os dados são licenciados sob CC BY 4.0 e exigem crédito apropriado; a [documentação de geocodificação](https://open-meteo.com/en/docs/geocoding-api) informa que os dados de localização têm origem no GeoNames.
- A cidade digitada ou coordenadas usadas na consulta são enviadas ao backend e ao provedor para obter o clima. A geolocalização é opcional, depende de permissão explícita e não deve ser armazenada pelo produto após a consulta.
- Meta de desempenho para a experiência principal: até 5 segundos em pelo menos 95% das consultas válidas sob condições normais e com o provedor disponível. Falhas ou atrasos do serviço externo devem ser tratados como estados recuperáveis da interface.

## Fora do escopo

- Previsão por hora, previsão para além de sete datas ou histórico meteorológico e comparação entre períodos.
- Mapas meteorológicos, alertas de tempo severo ou recomendações de saúde, segurança ou deslocamento.
- Cadastro, autenticação, favoritos, histórico de buscas ou sincronização entre dispositivos.
- Troca de unidades de medida; a primeira versão usa Celsius.
- Localização automática obrigatória ou coleta de localização sem ação e permissão do usuário.
- Integração direta do navegador com a Open-Meteo, provedores alternativos, banco de dados ou armazenamento persistente de consultas.
- Garantia de disponibilidade independente do provedor gratuito da Open-Meteo ou preparação para uso comercial sem licença correspondente.
