type Effect = (...args: any[]) => unknown
export const balloon: Effect
export const confetti: Effect
export const emoji: Effect
export function fire(effect: Effect, options: { origin?: Element | null; config?: Record<string, unknown>; zIndex?: number }): { cancel(): void }
