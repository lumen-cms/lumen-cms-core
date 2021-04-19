import { get3ColumnsSection } from '../../storybook/section'
import {
  storyBackground,
  storyColumn,
  storyParallaxItem,
  storyRow,
  storySectionParallax
} from '../../storybook/core/section'
import { storyHeadline } from '../../storybook/core/various'
import { SettingsPageProvider } from '../provider/SettingsPageProvider'
import { simpleSettings } from '../../storybook/toolbar'
import { LmPage } from '../page/Page'
import { PageStoryblok } from '../../typings/generated/components-schema'

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

export const Playground = () => (
  <div className="lm-parallax__wrapper">
    <SettingsPageProvider settings={simpleSettings} page={getObj()}>
      <LmPage />
    </SettingsPageProvider>
  </div>
)
