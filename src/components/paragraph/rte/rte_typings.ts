export interface RteContentProps {
  text: string
  type: 'text'
  marks: [{
    type: 'strike' | 'bold' | 'underline' | 'strong' | 'code' | 'italic' | 'link' | 'styled'
    attrs: {
      href: string
      uuid: string
      target: string | null
      linktype: 'story'
      class: string
    }
  }]
}

export interface RteProps {
  attrs: {
    level: number
  },
  type: 'blockquote' | 'bullet_list' | 'list_item' | 'ordered_list' | 'paragraph' | 'horizontal_rule' | 'hard_break' | 'image' | 'code_block' | 'heading'
  content: []
}
