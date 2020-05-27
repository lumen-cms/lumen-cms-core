import {  LmComponentRender as LmHubspotMeeting } from '../src/'
import React from 'react'
import { storyHubspotMeeting } from '../src/storybook/core/various'

export default {
  title: 'Hubspot Meeting'
}

export const Basic = () => (
  <LmHubspotMeeting content={storyHubspotMeeting({ options: { meeting_name: 'hello165' } })} disableEmbed={true} />
)
export const Playground = () => (
  <LmHubspotMeeting content={storyHubspotMeeting({ options: { meeting_name: 'maxuhlig81' } })} disableEmbed={true} />
)
