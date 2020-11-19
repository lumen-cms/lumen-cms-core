const localeRedirects = async (locales = []) => {
  const cdnUrl = `https://cdn-api.lumen.media/api/all-stories?token=${process.env.NEXT_PUBLIC_PREVIEW_TOKEN}&no_cache=true`
  const allPages = await fetch(cdnUrl).then((r) => r.json())
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
