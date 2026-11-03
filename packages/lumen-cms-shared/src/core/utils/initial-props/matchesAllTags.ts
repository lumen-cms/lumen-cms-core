// The requested set is shared across the story/category list. Count unique
// matching tags so duplicate tags on either side cannot change all-tag semantics.
export function matchesAllTags(
  tags: readonly string[],
  required: ReadonlySet<string>
) {
  if (!required.size) return true
  // Keep the original cheap first-tag rejection before indexing matches.
  const first = required.values().next().value as string
  if (!tags.includes(first)) return false
  if (required.size === 1) return true
  const matched = new Set<string>([first])
  for (const tag of tags) {
    if (required.has(tag)) {
      matched.add(tag)
      if (matched.size === required.size) return true
    }
  }
  return false
}
