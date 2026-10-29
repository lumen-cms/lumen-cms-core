// Adapt legacy consumer names in private verification copies only. Never use
// the preview credential as a fallback for the published-content credential.
function migrateConsumerEnv(source) {
  const names = {
    NEXT_PUBLIC_PUBLIC_TOKEN: 'NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY',
    NEXT_PUBLIC_PREVIEW_TOKEN: 'STORYBLOK_PREVIEW_TOKEN',
    NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN:
      'NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLISHABLE_KEY'
  }
  const lines = source.split('\n')
  const assignment = /^(\s*(?:export\s+)?)([A-Z][A-Z0-9_]*)(\s*=.*)$/
  const existing = new Set(lines.map((line) => assignment.exec(line)?.[2]))
  return lines
    .flatMap((line) => {
      const match = assignment.exec(line)
      const replacement = match && names[match[2]]
      if (!replacement) return [line]
      return existing.has(replacement)
        ? []
        : [`${match[1]}${replacement}${match[3]}`]
    })
    .join('\n')
}
module.exports = { migrateConsumerEnv }
