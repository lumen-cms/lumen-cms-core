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
