import { ParallaxProvider } from 'react-scroll-parallax'
import { get3ColumnsSection } from '../../storybook/section'
import {
  storyBackground,
  storyColumn,
  storyParallaxItem,
  storyRow,
  storySectionParallax
} from '../../storybook/core/section'
import { storyHeadline } from '../../storybook/core/various'
import SettingsPageProvider from '../provider/SettingsPageProvider'
import { simpleSettings } from '../../storybook/toolbar'
import { LmPage } from '../page/Page'
import {
  BackgroundStoryblok,
  ColumnStoryblok,
  HeadlineStoryblok,
  PageStoryblok,
  ParallaxItemStoryblok,
  RowStoryblok
} from '../../typings/generated/components-schema'
import LmSectionParallax from './SectionParallax'
import { storyImageUrls } from '../../storybook/contentHelper'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Layout/Section Parallax'
}

const getObj = () => {
  const pageObj: PageStoryblok = {
    _uid: 'page',
    component: 'page',
    body: [
      {
        ...storySectionParallax(),
        body: [
          {
            ...storyRow({
              knob: 'Content Parallax',
              options: {
                justify: 'center',
                align_content: 'flex-end'
              }
            }),
            background: [
              storyBackground({
                knob: 'Content Parallax',
                options: {
                  classNames: { values: ['text-center', 'text-white'] }
                }
              })
            ],
            body: [
              {
                ...storyColumn({ knob: 'Content Parallax' }),
                body: [
                  storyHeadline({
                    knob: 'Content Parallax',
                    options: { typography: 'headline2' }
                  })
                ]
              }
            ]
          }
        ],
        elements: [
          storyParallaxItem({
            options: {
              amount: 0.3,
              image:
                'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
            }
          })
        ]
      },
      get3ColumnsSection({ knob: '3 Column Section', count: 1 }),
      get3ColumnsSection({ knob: '3 Column Section', count: 2 }),
      get3ColumnsSection({ knob: '3 Column Section', count: 3 })
    ]
  }
  return pageObj
}

export const Basic = () => (
  <div style={{ height: '1000px' }}>
    <ParallaxProvider>
      <LmSectionParallax
        content={{
          _uid: 'section_parallax_headline',
          component: 'section_parallax',
          height: 80,
          elements: [
            {
              _uid: '14213',
              component: 'parallax_item',
              amount: 0.3,
              image: storyImageUrls[1]
            }
          ] as ParallaxItemStoryblok[],
          body: [
            {
              _uid: 'row-1',
              component: 'row',
              justify: 'center',
              align_content: 'flex-end',
              body: [
                {
                  _uid: 'column-1',
                  component: 'column',
                  width_general: '11',
                  width_phone: '4',
                  background: [
                    {
                      _uid: '1231',
                      component: 'background',
                      background_color: { rgba: 'rgba(0,0,0,0.6)' }
                    }
                  ] as BackgroundStoryblok[],
                  body: [
                    {
                      _uid: 'headline-1',
                      component: 'headline',
                      tag: 'h1',
                      typography: 'headline3',
                      align: 'center',
                      text: 'Some Headline Title',
                      custom_color: { rgba: '#fff' }
                    } as HeadlineStoryblok
                  ]
                } as ColumnStoryblok
              ]
            } as RowStoryblok
          ]
        }}
      />
    </ParallaxProvider>
  </div>
)

export const Playground = () => (
  <div className="lm-parallax__wrapper">
    <SettingsPageProvider settings={simpleSettings} page={getObj()}>
      <LmPage />
    </SettingsPageProvider>
  </div>
)
