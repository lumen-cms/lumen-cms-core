import {
  EcommerceCheckoutStoryblok,
  EcommerceShopifyCheckoutStoryblok
} from '../../typings/generated/components-schema'

export type LmEcommerceCheckoutProps = {
  content: Omit<
    import('../../typings/storyblok-extensions').StoryblokFields<EcommerceCheckoutStoryblok>,
    'integration'
  > & {
    integration?: (
      | NonNullable<EcommerceCheckoutStoryblok['integration']>[number]
      | EcommerceShopifyCheckoutStoryblok
    )[]
  }
}
