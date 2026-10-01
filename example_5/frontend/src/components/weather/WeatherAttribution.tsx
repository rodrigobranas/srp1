export function WeatherAttribution() {
  return (
    <footer className="border-t border-slate-200 pt-5 text-center text-xs leading-relaxed text-slate-500">
      Dados meteorológicos por <a className="font-semibold text-slate-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Geocodificação por <a className="font-semibold text-slate-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2" href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>
    </footer>
  )
}
