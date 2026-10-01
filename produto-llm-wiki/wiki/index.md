---
okf_version: "0.2"
---

# Conceitos

## Fonte

- [PRD de escolha de tema](fontes/prd-escolha-tema.md) - Requisitos para alternar a interface entre os temas escuro e claro com uma escolha temporária por aba.
- [PRD de alternância da unidade de temperatura](fontes/prd-alternancia-unidade.md) - Requisitos para alternar localmente as temperaturas do painel de clima entre Celsius e Fahrenheit.
- [PRD do painel de clima](fontes/prd-painel-de-clima.md) - Registro dos requisitos iniciais do painel de clima e de sua relação histórica com a especificação posterior de alternância de unidade.

## Capacidade

- [Painel de clima](capacidades/painel-de-clima.md) - Capacidade especificada para consultar o clima por cidade, alternar Celsius e Fahrenheit e escolher entre os temas claro e escuro.
- [Alternância de tema visual](capacidades/alternancia-de-tema-visual.md) - A interface alterna entre tema escuro e claro e mantém a escolha manual somente na aba atual, inclusive após recarga.
- [Alternância de unidade de temperatura](capacidades/alternancia-de-unidade-de-temperatura.md) - O painel reapresenta as temperaturas carregadas em Celsius ou Fahrenheit, mantendo Celsius como padrão de cada nova visita.

## Síntese e propostas

- [Propostas para próximas funcionalidades](sinteses/proximas-funcionalidades-painel-de-clima.md) - Três hipóteses de evolução para avaliar depois de confirmar o estado das capacidades já especificadas.

## Fluxo

- [Consultar clima por cidade](fluxos/consultar-clima-por-cidade.md) - Sequência especificada para buscar uma localidade, consultar o clima e recuperar-se de resultados ausentes ou falhas.

## Integração

- [Open-Meteo](integracoes/open-meteo.md) - Integração meteorológica especificada pelo PRD por meio do backend da aplicação.

## Restrição

- [Privacidade da localização no painel de clima](restricoes/privacidade-da-localizacao.md) - A localização do navegador é opcional, depende de ação e permissão e não deve ser armazenada pelo produto após a consulta.
