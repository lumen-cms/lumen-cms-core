import {  LmComponentRender as LmCardList } from '../src/'
import {
  CardListItemStoryblok,
  CardListStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok,
  ImageStoryblok,
  ParagraphStoryblok
} from '../src/typings/generated/components-schema'
import * as React from 'react'
import { storyCardList, storyCardListItem } from '../src/storybook/core/section'
import { loremIpsum } from 'lorem-ipsum'
import { getRandomImage } from '../src/storybook/core/various'

const cardListBody: CardListItemStoryblok[] = [{
  _uid: '123',
  component: 'card_list_item',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '123123',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Some Description',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '12321312',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Some Description',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '123213123',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Some Description',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '3wdswdeds',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '23421esafdsferf',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Some Description',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '3qwdefwef',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Some Description',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: 'jzhilz87zhtf',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Some Description',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}]

const cardListLongDescription: CardListItemStoryblok[] = [{
  _uid: '123',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
}, {
  _uid: '123123',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '12321312',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}, {
  _uid: '123213123',
  component: 'card_list_item',
  title: 'Toll',
  subtitle: 'SubTitle',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}]


const twitterPng = 'https://img2.storyblok.com/f/66717/273x256/42d8e47bd5/twitter-icon.png'
const fcbkPng = 'https://a.storyblok.com/f/66717/273x256/1af4758e5f/fb-icon.png'
const instaPng = 'https://img2.storyblok.com/f/66717/273x256/275fe57666/insta-icon.png'

const cardListIcons: CardListItemStoryblok[] = [{
  _uid: '123',
  component: 'card_list_item',
  image: instaPng
}, {
  _uid: '123123',
  component: 'card_list_item',
  image: fcbkPng
}, {
  _uid: '12321312',
  component: 'card_list_item',
  image: twitterPng
}]
const cardList: CardListStoryblok = {
  _uid: '12311',
  component: 'card_list',
  body: cardListBody
}

const cardListWithAction: CardListStoryblok = {
  _uid: '12311',
  component: 'card_list',
  body: cardListBody.map((cardItem, i) => ({
    ...cardItem,
    body: [{
      _uid: '543',
      component: 'headline',
      text: `Headline ${i}`
    }, {
      _uid: '2342',
      component: 'paragraph',
      text: `Some random ${i}\n\n **Some new line`
    }] as (HeadlineStoryblok | ParagraphStoryblok | ImageStoryblok)[]
  }))
}

export default {
  title: 'Cards'
}

export const CardList = () => (
  <LmCardList content={cardList} />
)
export const CardListOverImage = () => (
  <>
    <LmCardList content={{ ...cardList, variant: ['over_media', 'font_white', 'title_top'] }} />
    <LmCardList content={{ ...cardList, variant: ['over_media', 'font_white', 'text_top_bottom'] }} />
    <LmCardList content={{ ...cardList, variant: ['over_media', 'font_white', 'text_bottom'] }} />
    <LmCardList content={{ ...cardList, variant: ['over_media', 'font_white', 'text_center'] }} />
    <LmCardList
      content={{ ...cardList, variant: ['over_media', 'font_white', 'text_center', 'text_align_center'] }} />
    <LmCardList content={{ ...cardList, variant: ['over_media', 'font_white', 'text_bottom', 'text_align_right'] }} />
  </>
)
export const CardListResponsive = () => (
  <>
    <LmCardList content={{ ...cardList }} />
    <div style={{ height: '300px' }}>Some spacing</div>
    <LmCardList content={{ ...cardList, image_ratio: '1x1' }} />
    <div style={{ height: '300px' }}>Some spacing</div>
    <LmCardList content={{ ...cardList }} />
    <div style={{ height: '300px' }}>Some spacing</div>
    <LmCardList content={{ ...cardList, column_gap: '8' }} />
  </>
)
export const CardListCroppedDescription = () => (
  <>
    <LmCardList content={{ ...cardList, body: cardListLongDescription }} />
    <h3>Only 120 character</h3>
    <LmCardList content={{ ...cardList, body: cardListLongDescription, description_max_character: 120 }} />
    <h3>No description with value "0"</h3>
    <LmCardList content={{ ...cardList, body: cardListLongDescription, description_max_character: 0 }} />
  </>
)
export const CardsOfTravels = () => {
  const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  return (
    <div>
      <LmCardList content={{
        _uid: '23123',
        component: 'card_list',
        shadow_effect: 'soft',
        variant: ['over_media', 'text_bottom', 'overlay_content_no_space'],
        description_max_character: 40,
        title_class_name: { values: ['badge-square', 'badge-dark-transparent'] },
        card_actions_disable_spacing: true,
        body: elements.map(num => {
          return {
            _uid: 'elem-' + num,
            component: 'card_list_item',
            title: loremIpsum({ count: 1, units: 'words' }),
            image: getRandomImage(),
            description: loremIpsum({ count: 1, units: 'sentence' }),
            card_actions_body: [{
              _uid: 'asdfa',
              component: 'flex_row',
              justify: 'space-between',
              align_items: 'center',
              body: [{
                _uid: '123',
                component: 'headline',
                typography: 'body1',
                text: loremIpsum({ count: 1, units: 'words' })
              }, {
                _uid: '123',
                component: 'headline',
                typography: 'body2',
                text: loremIpsum({ count: 1, units: 'words' })
              }] as HeadlineStoryblok[]
            }] as FlexRowStoryblok[]
          } as CardListItemStoryblok
        })
      }} />
    </div>
  )
}
export const CardIcons = () => (
  <>
    <LmCardList
      content={{ ...cardList, elevation: '0', image_size: 'contain', image_ratio: '1x1', body: cardListIcons }} />
  </>
)
export const CardActions = () => (
  <>
    <LmCardList content={cardListWithAction} />
  </>
)
export const Playground = () => {

  return (
    <LmCardList content={{
      ...storyCardList(),
      body: [
        storyCardListItem({ count: 1 }),
        storyCardListItem({ count: 2 }),
        storyCardListItem({ count: 3 }),
        storyCardListItem({ count: 4 }),
        storyCardListItem({ count: 5 }),
        storyCardListItem({ count: 6 }),
        storyCardListItem({ count: 7 }),
        storyCardListItem({ count: 8 })
      ]
    }} />
  )
}


