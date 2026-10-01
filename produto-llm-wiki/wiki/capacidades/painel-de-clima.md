---
type: Product Capability
title: Painel de clima
description: Capacidade especificada para consultar o clima por cidade, alternar Celsius e Fahrenheit e escolher entre os temas claro e escuro.
tags: [painel-de-clima, clima, busca]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:22:52-03:00
status: draft
sources:
  - id: prd-painel-de-clima
    resource: ../../raw/painel-de-clima/prd.md
    title: Documento de Requisitos do Produto (PRD)
  - id: prd-alternancia-unidade
    resource: ../../raw/alternancia-unidade/prd.md
    title: PRD de alternância da unidade de temperatura
  - id: prd-escolha-tema
    resource: ../../raw/escolha-tema/prd.md
    title: PRD de escolha de tema
---

# Visão geral

O PRD especifica uma capacidade para visitantes consultarem o tempo de uma localidade dentro do frontend existente, sem conta. O fluxo aceita uma cidade digitada, resolve correspondências e apresenta condições atuais e previsão local para hoje e os seis dias seguintes. O PRD não confirma que a capacidade foi implementada.[^prd-painel-de-clima]

# Busca e seleção (PRD inicial)

RF1–RF3 exigem um campo rotulado, envio pelo botão ou pela tecla Enter, remoção de espaços excedentes antes de validar entrada vazia e seleção explícita quando houver cidades homônimas. As opções homônimas devem identificar região e país. CA-01 exige uma orientação para preencher a cidade e que uma entrada vazia não apresente dados antigos como resultado da nova consulta; CA-04 e CA-05 exigem identificar e consultar a localidade escolhida.

# Dados apresentados (PRD inicial)

RF4–RF9 do PRD inicial especificam que o backend resolve o nome e consulta a Open-Meteo; o navegador conversa somente com o backend da aplicação. Em caso de sucesso, o painel apresenta:

- **Condições atuais:** cidade e país, temperatura na unidade selecionada (Celsius inicial), descrição do tempo, sensação térmica, umidade, velocidade do vento e horário local dos dados.
- **Previsão diária:** sete datas locais, cada uma com data, descrição do tempo e temperaturas mínima e máxima.
- **Origem e estados:** atribuição visível à Open-Meteo, carregamento, ausência de resultados e falha de serviço com orientação para tentar novamente quando apropriado.

CA-02, CA-03, CA-05–CA-07, CA-09 e CA-11 do PRD inicial detalham sucesso, correspondência à cidade selecionada, cidade não encontrada, falha ou demora e atribuição. As condições atuais são descritas pela fonte como baseadas em modelos meteorológicos, não necessariamente em observação direta de uma estação; a apresentação não deve sugerir o contrário. Os limites de integração estão em [Open-Meteo](/integracoes/open-meteo.md).

# Unidades de temperatura

O escopo atual permite alternar entre Celsius e Fahrenheit por um controle no topo do painel. Celsius continua sendo o padrão ao abrir uma nova visita ou recarregar a página, e a seleção persiste durante as novas buscas na página atual. A troca reapresenta a temperatura atual, a sensação térmica e as mínimas e máximas da previsão sem nova consulta meteorológica; umidade, vento e demais medidas permanecem iguais. A funcionalidade e seus requisitos estão em [Alternância de unidade de temperatura](/capacidades/alternancia-de-unidade-de-temperatura.md), conforme o PRD de alternância.[^prd-alternancia-unidade]

O [PRD inicial do painel de clima](/fontes/prd-painel-de-clima.md) colocava a troca de unidades fora do escopo e definia Celsius como única unidade da primeira versão. Pela orientação do usuário em 2026-10-01, a especificação de alternância é a aplicável ao escopo atual da wiki. A declaração do PRD inicial é mantida como histórico, não como conflito de escopo em aberto; os dois documentos não informam versões ou datas que permitam deduzir essa relação apenas por metadados.

# Tema visual

O PRD de escolha de tema especifica tema escuro na abertura de cada aba, alternância imediata entre claro e escuro e manutenção da escolha manual após recarga somente naquela aba. Fechar a aba descarta a escolha; outra aba começa no escuro. O tema do sistema operacional não altera o padrão. A mudança deve preservar a tela e a interação atuais e não chama o backend. Consulte [Alternância de tema visual](/capacidades/alternancia-de-tema-visual.md).[^prd-escolha-tema]

O PRD de tema fala genericamente de frontend e não identifica este produto ou tela; sua relação com o Painel de clima é inferida do contexto deste bundle. Os PRDs anteriores de clima e de unidade não definiam tema visual; nenhuma divergência de escopo foi identificada.

# Acessibilidade e experiência (PRD inicial)

O público pode usar teclado ou tecnologia assistiva. US5 e CA-10 especificam rótulos acessíveis, operação por teclado, foco visível, comunicação de carregamento, erro e resultado a tecnologias assistivas, e proíbem que cor ou ícone sejam o único meio de transmitir uma condição. A interface e as mensagens devem estar em português do Brasil, adaptar-se a dispositivos móveis e desktops, e usar Celsius inicialmente.

# Localização opcional (PRD inicial)

RF10–RF11 e CA-08 permitem um atalho iniciado pelo usuário e sujeito à permissão do navegador. Se a pessoa negar a permissão ou a localização não estiver disponível, a busca manual deve continuar funcionando. A fonte não decide se a localização apenas sugere uma cidade ou inicia a consulta; essa questão permanece aberta em [Privacidade da localização](/restricoes/privacidade-da-localizacao.md).

# Desempenho (PRD inicial)

O objetivo e CA-12 estabelecem que pelo menos 95% das consultas válidas exibam resultados em até cinco segundos, sob condições normais de rede e com as APIs externas disponíveis. A taxa de consultas válidas concluídas e o tempo entre envio e exibição também são indicadores propostos. O PRD não define instrumentação, janela de medição ou tratamento estatístico.

O [fluxo de consulta](/fluxos/consultar-clima-por-cidade.md) relaciona esses requisitos às etapas e aos estados alternativos. O registro da fonte e das questões ainda não resolvidas está no [PRD do painel de clima](/fontes/prd-painel-de-clima.md).

# Propostas de evolução

A [síntese de propostas para próximas funcionalidades](/sinteses/proximas-funcionalidades-painel-de-clima.md) reúne hipóteses para avaliação futura. Elas não são requisitos aprovados nem fazem parte do escopo especificado nesta página.

[^prd-painel-de-clima]: [PRD original](../../raw/painel-de-clima/prd.md)
[^prd-alternancia-unidade]: [PRD de alternância da unidade de temperatura](../../raw/alternancia-unidade/prd.md)
[^prd-escolha-tema]: [PRD de escolha de tema](../../raw/escolha-tema/prd.md)
