Implemente um painel de clima no frontend e backend existente.

O usuário deve poder digitar uma cidade e ver o clima atual.

Para obter os dados, utilize a API Open-Meteo (gratuita, sem necessidade de API key):

- Geocoding API: https://geocoding-api.open-meteo.com/v1/search (converter cidade em coordenadas)
- Weather API: https://api.open-meteo.com/v1/forecast (obter dados do clima)

O frontend deve buscar os dados somente do backend. Opcionalmente, o frontend pode tentar obter a localização do usuário pelo navegador (geolocation) e sugerir a cidade automaticamente. 

Crie um endpoint no backend para o frontend consumir e exiba os dados no painel.
