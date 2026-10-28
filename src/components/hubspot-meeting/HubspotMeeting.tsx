import { useId } from 'react'
import { useExternalScript as useScript } from '../../utils/hooks/useExternalScript'
import { LmHubspotMeetingProps } from './hubspotTypes'

export default function LmHubspotMeeting({
  content,
  disableEmbed
}: LmHubspotMeetingProps): React.JSX.Element {
  const instanceId = useId()
  const dataSrc = `https://app.hubspot.com/meetings/${
    content.meeting_name
  }?embed-true=${disableEmbed ? 'false' : 'true'}`
  const status = useScript(
    content.meeting_name
      ? `https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js?id=${encodeURIComponent(
          instanceId
        )}&meeting=${encodeURIComponent(content.meeting_name)}&embed=${
          disableEmbed ? 'false' : 'true'
        }`
      : ''
  )
  if (status === 'error') {
    console.error('script of hubspot not loaded')
  }
  return (
    <div className="lm-hubspot-meeting">
      {content.meeting_name}
      <div className="meetings-iframe-container" data-src={dataSrc} />
    </div>
  )
}
