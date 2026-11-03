// Marked 4 heading-ID semantics, adapted under the adjacent MIT license.
// Keep existing fragment links stable when upgrading the Markdown engine.
export function createHeadingId() {
  const seen = new Map<string, number>()
  return (value: string) => {
    const raw = value.replace(
      /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
      (_, entity: string) => {
        const name = entity.toLowerCase()
        if (name === 'colon') return ':'
        if (name.startsWith('#x'))
          return String.fromCharCode(parseInt(name.slice(2), 16))
        if (name.startsWith('#'))
          return String.fromCharCode(Number(name.slice(1)))
        return ''
      }
    )
    const original = raw
      .toLowerCase()
      .trim()
      .replace(/<[!\/a-z].*?>/gi, '')
      .replace(
        /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
        ''
      )
      .replace(/\s/g, '-')
    let slug = original
    let count = seen.get(original) || 0
    if (seen.has(slug)) {
      do {
        slug = `${original}-${++count}`
      } while (seen.has(slug))
    }
    seen.set(original, count)
    seen.set(slug, 0)
    return slug
  }
}
