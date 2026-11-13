export function hasAuthContent(value: unknown): boolean {
 if (!value || typeof value !== 'object') return false
 const object = value as Record<string, unknown>
 return object.component === 'auth_container' || object.component === 'auth_form' || Object.values(object).some(hasAuthContent)
}
