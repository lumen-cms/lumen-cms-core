export interface SearchableListItem { uuid: string; full_slug: string; tag_list?: string[]; content: { preview_title?: string } }
/** Legacy category OR text matching; callers bypass filtering when both are empty. */
export function filterListItems<T extends SearchableListItem>(items: readonly T[], categories: string[], text?: string): T[] {
 const selected = new Set(categories)
 const pattern = text ? new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : undefined
 return items.filter(item => item.tag_list?.some(tag => selected.has(tag)) || !!pattern && [item.full_slug, item.content.preview_title].some(value => !!value && pattern.test(value)))
}
