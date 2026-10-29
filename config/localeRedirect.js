const localeRedirects = async (locales = []) => {
  const cdnUrl = `https://cdn-api.lumen.media/api/all-stories?token=${process.env.STORYBLOK_PREVIEW_TOKEN}&no_cache=true`
  const response = await fetch(cdnUrl)
  if (!response.ok) {
    throw new Error(`Unable to load locale redirects: HTTP ${response.status}`)
  }
  const allPages = await response.json()
  const redirects = []
  allPages.forEach((item) => {
    const slug = item.full_slug
    const localeFound = locales.find((lang) => slug.startsWith(`${lang}/`))
    if (localeFound) {
      redirects.push({
        source: `/${slug.replace(`${localeFound}/`, '')}`,
        destination: `/${slug}`,
        locale: false,
        permanent: true
      })
    }
  })
  return redirects
}
module.exports = localeRedirects
