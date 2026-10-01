---
type: Synthesis
title: Propostas para próximas funcionalidades do Painel de clima
description: Três hipóteses de evolução para avaliar depois de confirmar o estado das capacidades já especificadas.
tags: [painel-de-clima, roadmap, propostas]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:20:03-03:00
status: draft
sources:
  - id: prd-painel-de-clima
    resource: ../../raw/painel-de-clima/prd.md
    title: Documento de Requisitos do Produto (PRD)
  - id: privacidade-localizacao
    resource: /restricoes/privacidade-da-localizacao.md
    title: Privacidade da localização no painel de clima
  - id: open-meteo-weather-api
    resource: https://open-meteo.com/en/docs
    title: Open-Meteo Forecast API
---

# Natureza destas propostas

As sugestões abaixo são hipóteses de evolução, não requisitos aprovados, decisões de roadmap nem confirmação de implementação. A ordem é uma avaliação qualitativa de proximidade ao fluxo principal; não há dados de uso, pesquisa com usuários ou estimativa de esforço nesta wiki.

Antes de iniciar novas funcionalidades, convém confirmar quais capacidades já especificadas — busca por cidade, previsão diária e alternância Celsius/Fahrenheit — estão efetivamente disponíveis. As fontes atuais registram intenção de produto e não confirmam comportamento em produção.[^prd-painel-de-clima]

# 1. Previsão por hora com contexto de chuva

**Hipótese:** adicionar uma visão das próximas horas para a cidade consultada, com temperatura, sensação térmica e probabilidade ou volume de precipitação por horário local.

**Motivação inferida:** o painel já apresenta condições atuais e previsão diária; uma visão por hora ajudaria a pessoa a escolher quando sair ou planejar uma atividade no mesmo dia.

**Evidência e limite:** previsão por hora está fora do escopo do PRD inicial, então esta seria uma ampliação explícita. A documentação atual da Open-Meteo lista variáveis horárias como temperatura, sensação térmica, probabilidade de precipitação e precipitação; é necessário validar disponibilidade, cobertura e condições de uso para o endpoint e o mercado escolhidos.[^prd-painel-de-clima][^open-meteo-weather-api]

**Perguntas para validar:** quantas horas mostrar; quais campos ajudam a decidir; como explicar incerteza e diferenças entre modelos; e qual limite de desempenho a tela precisa cumprir.

# 2. Comparação temporária entre duas cidades

**Hipótese:** permitir escolher uma segunda cidade e comparar as condições atuais e a previsão diária das duas localidades na mesma página, sem salvar cidades favoritas ou histórico.

**Motivação inferida:** pode ajudar em decisões como comparar destino e origem ou avaliar duas cidades antes de viajar, usando o fluxo de busca que já existe.

**Limite de escopo e privacidade:** a comparação não está especificada. A regra atual diz que cidade ou coordenadas não devem ser armazenadas após a consulta, e não detalha retenção temporária durante uma comparação. É preciso esclarecer se manter duas localidades ativas apenas enquanto a pessoa compara é compatível com a regra.[^privacidade-localizacao]

**Perguntas para validar:** comparar dados atuais, previsão diária ou ambos; qual cidade fica em destaque em telas móveis; e como encerrar ou limpar a comparação.

# 3. Cartão de previsão para compartilhar

**Hipótese:** oferecer, após ação explícita da pessoa, uma prévia visual com a cidade, o horário local dos dados e um resumo meteorológico para baixar ou compartilhar.

**Motivação inferida:** um resumo legível fora do painel pode facilitar o envio da previsão a outras pessoas e criar um caminho de descoberta do produto.

**Limite de escopo e privacidade:** isso não está especificado e pode expor a cidade escolhida. O fluxo deve mostrar uma prévia, identificar claramente os dados e a atribuição à Open-Meteo, e só exportar ou compartilhar após confirmação. O produto não deve criar um histórico oculto; é necessário esclarecer como uma exportação iniciada pela pessoa se relaciona com a regra de não armazenar a localização após a consulta.[^privacidade-localizacao]

**Perguntas para validar:** quais campos entram no cartão; como representar a origem baseada em modelos; quais destinos de compartilhamento são necessários; e se a imagem é gerada localmente ou por um serviço.

# Ideias não priorizadas nesta lista

Favoritos e histórico de buscas não foram incluídos entre as três sugestões: o PRD lista ambos, assim como armazenamento persistente das consultas, como fora de escopo. Uma proposta futura nessa direção exigiria reavaliar essa decisão e a política de privacidade antes de desenhar a solução.[^prd-painel-de-clima][^privacidade-localizacao]

[^prd-painel-de-clima]: [PRD do painel de clima](/fontes/prd-painel-de-clima.md)
[^privacidade-localizacao]: [Privacidade da localização](/restricoes/privacidade-da-localizacao.md)
[^open-meteo-weather-api]: [Documentação da Forecast API da Open-Meteo](https://open-meteo.com/en/docs)
