import { LmComponentRender as LmHubspotMeeting } from '../components/CoreComponents'
import { storyHubspotMeeting } from '../storybook/core/various'

// eslint-disable-next-line import/no-anonymous-default-export
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
