import React from 'react'
import useScript, { ScriptStatus } from '@charlietango/use-script'
import { LmHubspotMeetingProps } from './hubspotTypes'

export default function LmHubspotMeeting({
  content,
  disableEmbed
}: LmHubspotMeetingProps): JSX.Element {
  const dataSrc = `https://app.hubspot.com/meetings/${
    content.meeting_name
  }?embed-true=${disableEmbed ? 'false' : 'true'}`
  const [, status] = useScript(
    content.meeting_name
      ? `https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js?id=${new Date().getTime()}`
      : ''
  )
  if (status === ScriptStatus.ERROR) {
    console.error('script of hubspot not loaded')
  }
  return (
    <div className="lm-hubspot-meeting">
      {content.meeting_name}
      <div className="meetings-iframe-container" data-src={dataSrc} />
    </div>
  )
}
