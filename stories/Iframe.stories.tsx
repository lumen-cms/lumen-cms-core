import {  LmComponentRender as LmIframe } from '../src/'
import { IframeAdvancedStoryblok, IframeStoryblok } from '../src/typings/generated/components-schema'
import * as React from 'react'
import { storyIframe } from '../src/storybook/core/various'

const props: IframeStoryblok = {
  _uid: '2313',
  component: 'iframe',
  url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
}

const advanced: IframeAdvancedStoryblok = {
  _uid: '1231',
  component: 'iframe_advanced',
  url: 'https://mysga.studentsgoabroad.com/?id=cj9sfuvq9onal0116182ztkb0'
}

const advanced2: IframeAdvancedStoryblok = {
  _uid: '1231332',
  component: 'iframe_advanced',
  url: 'https://mysga.studentsgoabroad.com/?id=cj9sl3csjyn7z0160hnehn855&fluid'
}

export default {
  title: 'IFrame'
}

export const Basic = () => (
  <>
    <LmIframe content={props} />
  </>
)
export const Responsive = () => (
  <>
    <h3>16 by 9</h3>
    <LmIframe content={{ ...props, responsive_ratio: '16by9' }} />
    <h3>4 by 3</h3>
    <LmIframe content={{ ...props, responsive_ratio: '4by3' }} />
  </>
)
export const Advanced = () => (
  <LmIframe content={advanced} />
)
export const WithMessage = () => (
  <LmIframe content={advanced2} />
)
export const Playground = () => (
  <>
    <LmIframe content={storyIframe({
      options: {
        responsive_ratio: '16by9',
        url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
      }
    })} />
  </>
)

