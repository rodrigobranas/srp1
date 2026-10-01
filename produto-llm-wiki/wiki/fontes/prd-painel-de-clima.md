---
type: Source Summary
title: PRD do painel de clima
description: Registro dos requisitos iniciais do painel de clima e de sua relação histórica com a especificação posterior de alternância de unidade.
resource: ../../raw/painel-de-clima/prd.md
tags: [painel-de-clima, prd, fonte]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:10:02-03:00
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

O PRD descreve um painel integrado ao frontend existente para visitantes consultarem o clima atual e a previsão diária de uma cidade sem sair da aplicação. O fluxo principal usa busca pelo nome da cidade, permite distinguir localidades homônimas por região e país e apresenta dados de hoje e dos seis dias seguintes.[^prd-painel-de-clima]

O nome “Painel de clima” é usado aqui como rótulo derivado do diretório da fonte; o PRD não informa um nome formal do produto. A fonte também não informa versão, status, data de publicação ou responsável. Não há outra fonte que confirme implementação ou comportamento em produção; os itens desta página representam intenção e requisitos especificados.

# Requisitos registrados

- **Busca e seleção (RF1–RF3):** campo rotulado, envio pelo botão ou Enter, rejeição de entrada vazia após remover espaços excedentes e escolha entre localidades homônimas identificadas por região e país.
- **Consulta e apresentação (RF4–RF9):** backend como único intermediário para geocodificação e dados meteorológicos da Open-Meteo; apresentação das condições atuais, previsão diária de sete datas locais, atribuição visível ao provedor e estados de carregamento, ausência de resultados e falha recuperável.
- **Localização opcional (RF10–RF11):** atalho de geolocalização somente após ação do usuário; se a permissão for negada ou a localização falhar, a busca manual continua disponível.
- **Critérios de aceite (CA-01–CA-12):** cobrem entrada vazia, sucesso e correspondência da localidade, localidades homônimas, cidade não encontrada, falhas ou demora do serviço, geolocalização, chamadas somente pelo backend, acessibilidade, atribuição à Open-Meteo e a meta de desempenho.

Os detalhes da capacidade estão em [Painel de clima](/capacidades/painel-de-clima.md), a sequência e seus caminhos alternativos em [Consultar clima por cidade](/fluxos/consultar-clima-por-cidade.md), a integração em [Open-Meteo](/integracoes/open-meteo.md) e o tratamento de localização em [Privacidade da localização](/restricoes/privacidade-da-localizacao.md).

# Escopo e metas

O público definido é formado por visitantes sem necessidade de conta. A primeira versão usa português do Brasil e Celsius, adapta-se a dispositivos móveis e desktops e permite pesquisar outra cidade. O objetivo de experiência é concluir consultas válidas em até cinco segundos em pelo menos 95% dos casos, sob condições normais de rede e com os serviços externos disponíveis; a fonte também indica como métricas a taxa de consultas válidas concluídas e o tempo entre envio e exibição.

Estão fora de escopo previsão por hora, períodos além das sete datas ou histórico, mapas, alertas, recomendações, contas, autenticação, favoritos, localização obrigatória, chamadas externas diretas do navegador, provedores alternativos e armazenamento persistente das consultas.

Na seção fora de escopo, este PRD declara que a troca de unidades não fará parte da primeira versão, que usa Celsius. Essa é uma afirmação histórica da fonte: em 2026-10-01, o usuário orientou a adotar o [PRD de alternância de unidade](/fontes/prd-alternancia-unidade.md), segundo o qual o painel agora oferece Celsius e Fahrenheit. A exclusão anterior não descreve o escopo atual da wiki; sua proveniência foi mantida sem presumir que a fonte tenha uma versão ou data que o comprove.[^prd-alternancia-unidade]

# Restrições e evidência

O PRD especifica que as condições atuais se baseiam em dados de modelos meteorológicos, não necessariamente em uma observação de estação local. Também afirma que o nível gratuito da Open-Meteo é destinado a uso não comercial, sujeito a cotas e condições sem garantia de disponibilidade, e que uso comercial requer licença comercial. A atribuição deve ser visível. Essas afirmações estão registradas como conteúdo do PRD, sem verificação independente nesta ingestão; consulte [Open-Meteo](/integracoes/open-meteo.md) para as referências citadas pela fonte.

# Questões em aberto

- Qual é o nome formal do produto e qual versão, status, data e responsável se aplicam a este PRD?
- A geolocalização será usada como sugestão de cidade ou como origem direta da consulta? RF10 permite ambas as interpretações.
- Como será definida e coletada a métrica de desempenho de cinco segundos em 95% das consultas válidas?
- Qual duração caracteriza “demora excessiva” para uma consulta?
- Como a interface deve preservar um resultado válido já mostrado após falha de uma nova busca, considerando que CA-01 proíbe apresentar dados antigos como resultado de uma busca vazia?
- Qual formato e local de exibição atenderão à atribuição da Open-Meteo?
- Como o requisito de não armazenar localização após a consulta será aplicado a logs, telemetria e retenção técnica?
- Que fontes confirmarão a implementação e o comportamento em produção?

[^prd-painel-de-clima]: [PRD original](../../raw/painel-de-clima/prd.md)
[^prd-alternancia-unidade]: [PRD de alternância da unidade de temperatura](../../raw/alternancia-unidade/prd.md)
