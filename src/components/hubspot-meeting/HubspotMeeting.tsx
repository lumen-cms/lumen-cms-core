import React from 'react'
import { HubspotMeetingStoryblok } from '../../typings/generated/components-schema'
import { useScript } from '../../utils/hooks/useScript'

export type LmHubspotMeetingProps = {
  content: HubspotMeetingStoryblok
  disableEmbed?: boolean
}

export function LmHubspotMeeting({ content, disableEmbed }: LmHubspotMeetingProps): JSX.Element {
  const dataSrc = `https://app.hubspot.com/meetings/${content.meeting_name}?embed-true=${disableEmbed ? 'false' : 'true'}`
  const { error } = useScript(content.meeting_name ? `https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js?id=${new Date().getTime()}` : '')
  if (error) {
    console.error('script of hubspot not loaded')
  }
  return (
    <div className="lm-hubspot-meeting">
      {content.meeting_name}
      <div className="meetings-iframe-container" data-src={dataSrc} />
    </div>
  )
}
