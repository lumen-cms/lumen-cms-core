export const fetchGoogleFormDataClient = async (url: string) => {
  if (url.indexOf('docs.google.com') !== -1) {
    const response = await fetch(
      `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${btoa(
        url.trim()
      )}`
    )
    if (!response.ok) {
      throw new Error(`Google Form proxy request failed: ${response.status}`)
    }
    return response.text()
  }
  return ''
}
