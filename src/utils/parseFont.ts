import { GlobalStoryblok } from '../typings/generated/components-schema'

export default function parseFont(string?: string) {
  if (!string) return null
  const name = string.split(':')[0]
  return name.replace(/\+/g, ' ')
}

const SETTINGS_FONT_KEYS = [
  'theme_font_default',
  'theme_font_alt1',
  'theme_font_alt2',
  'theme_font_alt3',
  'theme_font_alt4'
] as const

const DEFAULT_FONT = 'Nunito:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700'

// [ital, wght]
type FontTuple = [number, number]

type ParsedFont =
  | { family: string; tuples: FontTuple[] }
  | { family: string; spec: string }

const CSS1_VARIANT = /^(\d{3})?(i|italic)?$/

function parseCss1Variant(variant: string): FontTuple | null {
  const value = variant.trim().toLowerCase()
  if (value === 'regular') return [0, 400]
  if (value === 'bold') return [0, 700]
  const match = value.match(CSS1_VARIANT)
  if (!match || (!match[1] && !match[2])) return null
  return [match[2] ? 1 : 0, match[1] ? Number(match[1]) : 400]
}

function parseCss2Spec(spec: string): FontTuple[] | null {
  const [axesPart, valuesPart] = spec.split('@')
  if (!valuesPart) return null
  const axes = axesPart.split(',').map((axis) => axis.trim())
  const wghtIndex = axes.indexOf('wght')
  const italIndex = axes.indexOf('ital')
  if (wghtIndex === -1 || axes.length !== (italIndex === -1 ? 1 : 2)) {
    return null
  }
  const tuples: FontTuple[] = []
  for (const tuple of valuesPart.split(';')) {
    const values = tuple.split(',').map((value) => value.trim())
    if (
      values.length !== axes.length ||
      values.some((value) => !/^\d+$/.test(value))
    ) {
      return null
    }
    tuples.push([
      italIndex === -1 ? 0 : Number(values[italIndex]),
      Number(values[wghtIndex])
    ])
  }
  return tuples
}

function parseFontValue(value: string): ParsedFont | null {
  const separator = value.indexOf(':')
  const rawFamily = separator === -1 ? value : value.slice(0, separator)
  const spec = separator === -1 ? '' : value.slice(separator + 1).trim()
  const family = rawFamily.replace(/\+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!family) return null
  if (!spec) return { family, tuples: [[0, 400]] }

  if (spec.includes('@')) {
    const tuples = parseCss2Spec(spec)
    return tuples ? { family, tuples } : { family, spec }
  }

  const variants = spec.split(',').map(parseCss1Variant)
  if (variants.every((variant): variant is FontTuple => !!variant)) {
    return { family, tuples: variants }
  }
  return { family, spec: `wght@${spec.split(',').join(';')}` }
}

function renderFamily(family: string, tuples: FontTuple[]) {
  const name = family.replace(/ /g, '+')
  const unique = [...new Map(tuples.map((t) => [t.join(','), t])).values()]
  unique.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (unique.length === 1 && unique[0][0] === 0 && unique[0][1] === 400) {
    return name
  }
  if (unique.every(([ital]) => ital === 0)) {
    return `${name}:wght@${unique.map(([, wght]) => wght).join(';')}`
  }
  return `${name}:ital,wght@${unique.map((t) => t.join(',')).join(';')}`
}

function renderParsedFont(font: ParsedFont) {
  return 'tuples' in font
    ? renderFamily(font.family, font.tuples)
    : `${font.family.replace(/ /g, '+')}:${font.spec}`
}

/**
 * Builds the Google Fonts css2 families for the Storyblok font settings.
 * Entries of the same family are merged into a single sorted family
 * (Google rejects duplicate or unsorted tuples). Families that use axes other
 * than `ital`/`wght` or ranges are passed through unmerged.
 */
export const getGoogleFontFamilies = (
  settings: Partial<GlobalStoryblok>
): string[] => {
  const byFamily = new Map<string, ParsedFont[]>()
  SETTINGS_FONT_KEYS.forEach((key) => {
    const value = settings[key]?.trim()
    const parsed = value ? parseFontValue(value) : null
    if (parsed) {
      byFamily.set(parsed.family, [
        ...(byFamily.get(parsed.family) || []),
        parsed
      ])
    }
  })
  if (!byFamily.size) {
    const parsed = parseFontValue(DEFAULT_FONT) as ParsedFont
    byFamily.set(parsed.family, [parsed])
  }

  return [...byFamily.entries()].flatMap(([family, fonts]) => {
    if (fonts.every((font) => 'tuples' in font)) {
      return [
        renderFamily(
          family,
          fonts.flatMap((font) => ('tuples' in font ? font.tuples : []))
        )
      ]
    }
    return [...new Set(fonts.map(renderParsedFont))]
  })
}

export const getFontBasedOnSetting = (settings: Partial<GlobalStoryblok>) => {
  const families = getGoogleFontFamilies(settings).join('&family=')
  return `https://fonts.googleapis.com/css2?family=${families}${
    process.env.NEXT_PUBLIC_LAZY_FONT_DISABLE ? '' : '&display=swap'
  }`
}
