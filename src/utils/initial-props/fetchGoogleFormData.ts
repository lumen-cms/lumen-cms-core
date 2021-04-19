export const fetchGoogleFormData = async (url: string) => {
  if (url.indexOf('docs.google.com') !== -1) {
    const hijackedUrl = `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${Buffer.from(
      url.trim()
    ).toString('base64')}`
    return fetch(hijackedUrl).then((r) => r.text())
  }
  return ''
}
