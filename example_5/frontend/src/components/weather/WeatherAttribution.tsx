export function WeatherAttribution() {
  return (
    <footer className="border-t border-border pt-5 text-center text-xs leading-relaxed text-muted-foreground">
      Dados meteorológicos por <a className="font-semibold text-foreground underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Geocodificação por <a className="font-semibold text-foreground underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>
    </footer>
  )
}
