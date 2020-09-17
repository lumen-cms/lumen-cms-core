export function hijackGoogleFormsXHR(XHR: {
  prototype: XMLHttpRequest
  new (): XMLHttpRequest
  readonly DONE: number
  readonly HEADERS_RECEIVED: number
  readonly LOADING: number
  readonly OPENED: number
  readonly UNSENT: number
}) {
  const { open } = XHR.prototype
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  XHR.prototype.open = function openXhr(method, url, async, user, pass) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this._url = url
    if (
      url.indexOf('gstatic.com') !== -1 ||
      url.indexOf('docs.google.com') !== -1
    ) {
      url = `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${btoa(
        url
      )}`
    }
    open.call(this, method, url, async, user, pass)
  }
}
