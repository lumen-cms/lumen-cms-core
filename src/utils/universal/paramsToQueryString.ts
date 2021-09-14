const has = Object.prototype.hasOwnProperty

export const queryStringify = (
  obj: any,
  prefix?: string,
  isArray?: boolean
): string => {
  const pairs = []
  for (const key in obj) {
    if (!has.call(obj, key)) {
      continue
    }
    const value = obj[key]
    const enkey = isArray ? '' : encodeURIComponent(key) // no index array
    let pair
    if (typeof value === 'object') {
      pair = queryStringify(
        value,
        prefix ? prefix + encodeURIComponent('[' + enkey + ']') : enkey,
        Array.isArray(value)
      )
    } else {
      pair =
        (prefix ? prefix + encodeURIComponent('[' + enkey + ']') : enkey) +
        '=' +
        encodeURIComponent(value)
    }
    pairs.push(pair)
  }
  return pairs.join('&')
}
