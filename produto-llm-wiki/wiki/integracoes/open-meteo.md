---
type: Integration
title: Open-Meteo
description: Integração meteorológica especificada pelo PRD por meio do backend da aplicação.
resource: https://open-meteo.com/
tags: [open-meteo, integração, clima]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:10:45-03:00
status: draft
sources:
  - id: prd-painel-de-clima
    resource: ../../raw/painel-de-clima/prd.md
    title: Documento de Requisitos do Produto (PRD)
  - id: prd-alternancia-unidade
    resource: ../../raw/alternancia-unidade/prd.md
    title: PRD de alternância da unidade de temperatura
---

# Visão geral

O PRD escolhe a Open-Meteo para resolver nomes de localidades e obter condições atuais e previsão diária. A integração é feita pelo backend da aplicação; o frontend não consulta diretamente serviços externos de geocodificação ou clima (RF4–RF5, CA-09). Esta página registra o que a fonte especifica e não confirma a integração implementada.[^prd-painel-de-clima]

# Serviços e dados

- A Geocoding API é indicada para resolver nomes de cidade e obter dados da localidade.
- A Weather Forecast API é indicada para consultar dados atuais e variáveis diárias, incluindo códigos do tempo e temperaturas mínima e máxima.
- O PRD de alternância especifica que as temperaturas recebidas permanecem em Celsius e que a exibição em Fahrenheit ou Celsius é convertida no frontend a partir dos dados já carregados. A escolha de unidade não altera a API nem cria uma chamada adicional ao provedor.[^prd-alternancia-unidade]
- A previsão exibida pela capacidade de [Painel de clima](/capacidades/painel-de-clima.md) cobre hoje e os seis dias seguintes na data local da cidade.
- O PRD afirma que condições atuais usam dados de modelos meteorológicos, descritos como dados de modelo de 15 minutos, e não necessariamente leituras de uma estação local. A interface não deve comunicar precisão de observação direta.
- A fonte atribui os dados de geocodificação ao GeoNames.

# Licença, disponibilidade e atribuição

Segundo o PRD, o nível gratuito sem chave mencionado no pedido destina-se a uso não comercial, está sujeito às cotas e condições publicadas e não garante disponibilidade. Uso comercial exige licença comercial, que deve ser validada antes de qualquer uso comercial. O PRD também afirma que os dados meteorológicos usam CC BY 4.0 e requerem crédito apropriado. RF8 e CA-11 exigem que a atribuição à Open-Meteo seja visível no painel.

Essas condições são afirmações registradas da fonte do produto e não foram verificadas independentemente nesta ingestão. O PRD aponta para a [Geocoding API](https://open-meteo.com/en/docs/geocoding-api), a [Weather Forecast API](https://open-meteo.com/en/docs) e a [página de preços e condições de uso](https://open-meteo.com/en/pricing). A forma do crédito e sua localização na interface continuam sem definição.

# Relações

O backend integra o provedor para atender ao [fluxo de consulta por cidade](/fluxos/consultar-clima-por-cidade.md). O painel deve atender a acessibilidade e exibição definidas em [Painel de clima](/capacidades/painel-de-clima.md). O envio de cidade ou coordenadas está relacionado à [privacidade da localização](/restricoes/privacidade-da-localizacao.md).

[^prd-painel-de-clima]: [PRD original](../../raw/painel-de-clima/prd.md)
[^prd-alternancia-unidade]: [PRD de alternância da unidade de temperatura](../../raw/alternancia-unidade/prd.md)
