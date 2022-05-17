import {
  HubspotFormStoryblok,
  HubspotMeetingStoryblok
} from '../../typings/generated/components-schema'

export type LmHubspotMeetingProps = {
  content: HubspotMeetingStoryblok
  disableEmbed?: boolean
}

export type LmHubspotFormProps = {
  content: HubspotFormStoryblok
}
