// https://stackoverflow.com/questions/56173848/want-to-convert-a-nested-object-to-query-parameter-for-attaching-to-url
const getPairs = (obj: any, keys = []) =>
  Object.entries(obj).reduce((pairs, [key, value]) => {
    if (typeof value === 'object') {
      // @ts-ignore
      pairs.push(...getPairs(value, [...keys, key]))
    } else {
      // @ts-ignore
      pairs.push([[...keys, key], value])
    }
    return pairs
  }, [])

export const createDeepNestedQueryString = (obj: any) =>
  getPairs(obj)
    .map(
      // @ts-ignore
      ([[key0, ...keysRest], value]) =>
        `${key0}${keysRest.map((a) => `[${a}]`).join('')}=${value}`
    )
    .join('&')
