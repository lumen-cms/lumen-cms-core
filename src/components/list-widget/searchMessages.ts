/** Keep the framework-neutral package copy in sync (covered by search tests). */
const messages = {
  en: {
    search: 'Search',
    placeholder: 'Search pages and landing pages',
    close: 'Close search',
    minimum: 'Type at least 2 characters to search.',
    searching: 'Searching…',
    error: 'Search could not be loaded.',
    retry: 'Retry',
    empty: 'No results found.',
    result: 'result',
    results: 'results'
  },
  de: {
    search: 'Suche',
    placeholder: 'Seiten und Landingpages durchsuchen',
    close: 'Suche schließen',
    minimum: 'Gib mindestens 2 Zeichen ein, um zu suchen.',
    searching: 'Suche läuft…',
    error: 'Die Suche konnte nicht geladen werden.',
    retry: 'Erneut versuchen',
    empty: 'Keine Ergebnisse gefunden.',
    result: 'Ergebnis',
    results: 'Ergebnisse'
  }
}

export function getSearchMessages(locale?: string) {
  const language = locale?.trim().toLowerCase().split(/[-_]/)[0]
  return messages[language === 'de' ? 'de' : 'en']
}

export function searchResultCount(count: number, locale?: string) {
  const labels = getSearchMessages(locale)
  return `${count} ${count === 1 ? labels.result : labels.results}`
}
