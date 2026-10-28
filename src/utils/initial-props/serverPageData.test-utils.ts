export type PageDataJson =
  | null
  | string
  | number
  | boolean
  | PageDataJson[]
  | { [key: string]: PageDataJson }

/** Only proven per-load values are normalized; content versions stay checked. */
export function canonicalPageData(
  value: PageDataJson,
  path = ''
): PageDataJson {
  if (Array.isArray(value))
    return value.map((item, index) =>
      canonicalPageData(item, `${path}[${index}]`)
    )
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => {
          const item = value[key]
          if (
            key === 'cv' &&
            path.endsWith('.list_widget_data') &&
            typeof item === 'number' &&
            Number.isFinite(item)
          )
            return [key, '<build timestamp>']
          // Confirmed with two read-only GETs of the same public form. Validate
          // presence/type/format, so an empty or malformed token still fails.
          if (
            key === 'fbzx' &&
            path.endsWith('.form_data') &&
            typeof item === 'string' &&
            /^-?\d+$/.test(item)
          )
            return [key, '<Google Forms hidden token>']
          return [key, canonicalPageData(item, `${path}.${key}`)]
        })
    )
  return value
}
