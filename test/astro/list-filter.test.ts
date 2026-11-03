import { expect, it } from 'vitest'
import { filterListItems } from '../../packages/lumen-cms-shared/src/listFilter'
import { legacyClientListWidgetSearch } from '../../src/components/list-widget/useListSearch'
import type { AllStoryData } from '../../src/typings/app'
const items = [
 { uuid: 'a', full_slug: 'one', tag_list: ['tag'], content: { preview_title: 'One [literal]' } },
 { uuid: 'b', full_slug: 'two', tag_list: ['other'], content: { preview_title: 'Two' } },
 { uuid: 'c', full_slug: 'untagged', content: {} }
]
it.each([
 [[], ''], [[], 'ONE'], [['other'], 'ONE'], [['tag'], ''], [['TAG'], ''], [[], '[literal]'], [[], '('], [[], '.*']
] as [string[], string][] )('matches existing category/text filtering for %j / %s', (categories, text) => {
 expect(filterListItems(items, categories, text)).toEqual(legacyClientListWidgetSearch(items as unknown as AllStoryData, { searchParamsCategories: categories, searchText: text }))
})
