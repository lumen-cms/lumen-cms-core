import { ParallaxProvider } from 'react-scroll-parallax'
import {
  storyParallaxItem,
  storySectionParallax
} from '../storybook/core/section'
import SettingsPageProvider from '../components/provider/SettingsPageProvider'
import { simpleSettings } from '../storybook/toolbar'
import { LmPage } from '../components/page/Page'
import {
  BackgroundStoryblok,
  ColumnStoryblok,
  FlexRowStoryblok,
  HeadlineStoryblok,
  PageStoryblok,
  ParallaxItemStoryblok,
  RowStoryblok
} from '../typings/generated/components-schema'
import LmSectionParallax from '../components/section/SectionParallax'
import { storyImageUrls } from '../storybook/contentHelper'

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
        ratio: '4/3',
        elements: [
          storyParallaxItem({
            options: {
              speed: -20,
              image:
                'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
            }
          }),
          {
            speed: -10,
            scale: '1,1.5',
            opacity: '0.5, 1',
            // always_complete_animation: true,
            // translateX: '-100, 100, easeOutCubic',
            children: [
              {
                _uid: '2dfsf',
                component: 'flex_row',
                justify: 'center',
                align_content: 'center',
                column: true,
                full_height: true,
                body: [
                  {
                    component: 'headline',
                    _uid: '123123',
                    custom_color: {
                      rgba: '#fff'
                    },
                    text: 'Some Headline'
                  } as HeadlineStoryblok
                ]
              } as FlexRowStoryblok
            ]
          } as ParallaxItemStoryblok
        ]
      }
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
  <div className="lm-parallax__wrapper" style={{ height: '1000px' }}>
    <SettingsPageProvider settings={simpleSettings} page={getObj()}>
      <LmPage />
    </SettingsPageProvider>
  </div>
)
