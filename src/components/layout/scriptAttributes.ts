export function parseToAttributes(attributes?: string) {
  if (!attributes) return undefined
  return Object.fromEntries(
    attributes.split(',').map((attribute) => {
      const [name, value] = attribute.trim().split('=')
      return [name, value]
    })
  )
}
