// Application-added metadata and legacy content fields absent from the shared
// CMS schema. Kept separate so official CLI regeneration cannot erase them.
import type { CSSProperties } from 'react'

declare module './generated/components-schema' {
  interface GlobalStoryblok {
    uuid?: string
  }
  interface PageStoryblok {
    uuid?: string
  }
  interface BottomNavigationItemStoryblok {
    content?: { show_label?: boolean }
  }
  interface FormSelectStoryblok {
    help_text?: string
  }
  interface FormSelectOptionStoryblok {
    id?: string
  }
  interface RowStoryblok {
    background_style?: '' | 'fixed_cover' | 'fixed_image'
  }
  interface NewsStoryblok {
    body?: ColumnStoryblok['body']
  }
  interface ButtonStoryblok {
    name?: string
  }
  interface NavMenuStoryblok {
    header?: string
  }
  interface ImageStoryblok {
    fit_in_color?: string
  }
  interface IframeStoryblok {
    name?: string
    position?: CSSProperties['position']
  }
  interface HeadlineStoryblok {
    style?: string
    style_props?: string | string[]
  }
  interface ParagraphStoryblok {
    style?: string
  }
  interface RichTextEditorStoryblok {
    style?: string
    text?: string
  }
  interface ParallaxItemStoryblok {
    parallax_item_data?: { base64?: string }
  }
}

// Omit<T, K> erases known properties when T has a string index signature.
// Key remapping preserves them while removing open-ended fields.
export type StoryblokFields<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : K]: T[K]
}
