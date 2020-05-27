import {  LmComponentRender as LmHtml } from '../src/'
import { storyHtml } from '../src/storybook/core/various'
import React from 'react'

export default {
  title: 'HTML'
}

export const Basic = () => (
  <>
    <LmHtml content={storyHtml({
      options: {
        body: '<h3>Hello World!</h3>'
      }
    })} />
  </>
)
Basic.story = {
  parameters: {
    knobs: {
      escapeHTML: false
    }
  }
}

export const Mixcloud = () => (
  <>
    <LmHtml content={storyHtml({
      options: {
        lazy_load: true,
        body: '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fladyflic%2Felevation-radio-with-lady-flic-8%2F" frameborder="0" ></iframe>'
      }
    })} />
    <div className="p-5"></div>
    <LmHtml content={storyHtml({
      knob: 'Html 2',
      options: {
        lazy_load: true,
        body: '<iframe width="100%" height="60" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fladyflic%2Flady-flic-at-caf%C3%A9-del-mar-bali%2F" frameborder="0" ></iframe>'
      }
    })} />
  </>
)
Mixcloud.story = {
  parameters: {
    knobs: {
      escapeHTML: false
    }
  }
}
