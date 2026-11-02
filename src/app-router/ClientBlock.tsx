'use client'

import './registry'
import { LmComponentRender } from '../components/CoreComponents'
import type { ComponentRenderContent } from '../typings/app'

export type ClientBlockContent = Extract<
  ComponentRenderContent,
  {
    component:
      | 'headline'
      | 'button'
      | 'button_list'
      | 'nav_menu'
      | 'toolbar_logo'
      | 'toolbar_navi_button'
      | 'toolbar_row_section'
      | 'toolbar_row'
      | 'date_headline'
      | 'divider'
      | 'rich_text_editor'
      | 'image'
      | 'avatar'
      | 'html'
      | 'iframe'
      | 'list_search_autocomplete'
      | 'snackbar'
  }
>

// Islands that still need the existing component's browser behavior.
export function ClientBlock({ content }: { content: ClientBlockContent }) {
  return <LmComponentRender content={content} />
}
