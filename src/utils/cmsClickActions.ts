// CMS content may select application-owned behavior, never supply executable code.
export const cmsClickActions = new Map<string, () => void>()

export function getCmsClickProps(action: unknown) {
  const handler =
    typeof action === 'string' ? cmsClickActions.get(action) : undefined
  return typeof handler === 'function' ? { onClick: handler } : {}
}
