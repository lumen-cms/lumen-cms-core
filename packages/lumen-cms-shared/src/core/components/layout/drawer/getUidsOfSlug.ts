/** Find the first active branch in JSON CMS content, preserving drawer matching. */
export function getUidsOfSlug(
  children: unknown[],
  activeRoutePath?: string
): string[] {
  if (!activeRoutePath || activeRoutePath === '/') return []

  function visit(
    value: unknown,
    parent: unknown,
    ancestors: string[]
  ): string[] | undefined {
    const object =
      value !== null && typeof value === 'object'
        ? (value as Record<string, unknown>)
        : undefined
    const uids =
      object && typeof object._uid === 'string'
        ? [...ancestors, object._uid]
        : ancestors
    const keys = object ? Object.keys(object) : []

    // The former findPathDeep predicate inspected the parent of each leaf.
    // Keep its traversal order and substring matching, including empty values.
    if (!keys.length) {
      const link = (parent as { link?: { cached_url?: string } } | null)?.link
      return `/${link?.cached_url}`.includes(activeRoutePath!)
        ? uids
        : undefined
    }
    for (const key of keys) {
      const result = visit(object![key], value, uids)
      if (result) return result
    }
    return undefined
  }

  return visit(children, undefined, []) ?? []
}
