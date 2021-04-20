import { LmComponentRender as LmHubspotMeeting } from '@LmComponentRender'
import { storyHubspotMeeting } from '../../storybook/core/various'

export default {
  title: 'Integrations/Hubspot Meeting'
}

export const Basic = () => (
  <LmHubspotMeeting
    content={storyHubspotMeeting({ options: { meeting_name: 'hello165' } })}
    disableEmbed
  />
)
export const Playground = () => (
  <LmHubspotMeeting
    content={storyHubspotMeeting({ options: { meeting_name: 'maxuhlig81' } })}
    disableEmbed
  />
)
