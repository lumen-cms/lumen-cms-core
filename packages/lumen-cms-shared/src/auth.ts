/** Public profile only. Tokens and arbitrary identity-provider claims stay server-side. */
export interface AuthUser {
 sub: string
 id?: string
 email?: string
 firstName?: string
 lastName?: string
 language?: string
 roles: string[]
}
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error'
export function normalizeUser(claims: Record<string, unknown> | undefined, roleClaim = 'roles', roleKey?: string): AuthUser | undefined {
 if (!claims || typeof claims.sub !== 'string') return undefined
 const text = (key: string) => typeof claims[key] === 'string' ? claims[key] as string : undefined
 const source = claims[roleClaim]
 const roles = Array.isArray(source) ? source.map(item => roleKey && item && typeof item === 'object' ? item[roleKey] : item).filter((role): role is string => typeof role === 'string') : []
 return { sub: claims.sub, id: text('id'), email: text('email'), firstName: text('given_name'), lastName: text('family_name'), language: text('lang') || text('locale'), roles }
}
export function hasRoles(required: readonly string[], user?: Pick<AuthUser, 'roles'> | null): boolean {
 return !!user && (required.includes('any') || required.some(role => user.roles.includes(role)))
}
export function matchAuthRule<T extends { path: string; roles: string[] }>(path: string, rules: readonly T[] = []): T | undefined {
 const clean = (value: string) => '/' + value.split(/[?#]/)[0].split('/').filter(Boolean).join('/')
 const current = clean(path)
 return [...rules].sort((a, b) => clean(b.path).length - clean(a.path).length).find(rule => {
  const prefix = clean(rule.path)
  return prefix === '/' || current === prefix || current.startsWith(prefix + '/')
 })
}
export function safeReturnTo(value: unknown, origin: string, fallback = '/'): string {
 if (typeof value !== 'string' || !value || /[\\\r\n]/.test(value)) return fallback
 try { const url = new URL(value, origin); return url.origin === new URL(origin).origin ? url.pathname + url.search + url.hash : fallback } catch { return fallback }
}
