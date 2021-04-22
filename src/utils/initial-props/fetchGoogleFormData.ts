export const fetchGoogleFormData = async (url: string) => {
  if (url.indexOf('docs.google.com') !== -1) {
    return fetch(
      `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${Buffer.from(
        url.trim()
      ).toString('base64')}`
    ).then((r) => r.text())
  }
  return ''
}
export const fetchGoogleFormDataClient = async (url: string) => {
  if (url.indexOf('docs.google.com') !== -1) {
    return fetch(
      `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${btoa(
        url.trim()
      )}`
    ).then((r) => r.text())
  }
  return ''
}
