const has = (value: unknown, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(value, key)

export const queryStringify = (
  obj: unknown,
  prefix?: string,
  isArray?: boolean
): string => {
  const pairs = []
  for (const key in obj as Record<string, unknown>) {
    if (!has(obj, key)) {
      continue
    }
    const value = (obj as Record<string, unknown>)[key]
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
        // Preserve native coercion, including undefined and throwing for symbols.
        (encodeURIComponent as (value: unknown) => string)(value)
    }
    pairs.push(pair)
  }
  return pairs.join('&')
}
