// These are trusted, external providers used by the saved reference sites.
// Normal origin access is required for their storage/authentication. Do not
// extend this list from CMS content or grant these permissions to our own origin.
const providerPermissions: Record<string, string> = {
  'https://www.youtube.com':
    'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox',
  'https://www.youtube-nocookie.com':
    'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox',
  'https://docs.google.com':
    'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox',
  'https://mysga.studentsgoabroad.com':
    'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads'
}

export function getIframeSandbox(src?: string, parentOrigin?: string): string {
  // Unknown and same-origin embeds can run, but cannot access origin storage,
  // reach the parent's DOM, remove their sandbox, open popups or navigate top.
  const fallback = 'allow-scripts allow-forms allow-presentation'
  if (!src || !parentOrigin) return fallback
  try {
    const url = new URL(src, parentOrigin)
    if (url.origin === new URL(parentOrigin).origin) return fallback
    return providerPermissions[url.origin] || fallback
  } catch {
    return fallback
  }
}
