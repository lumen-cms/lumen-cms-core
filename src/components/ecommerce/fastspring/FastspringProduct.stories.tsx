import { LmCoreComponents } from '@CONFIG'
import { LmComponentRender } from '@LmComponentRender'
import { appContext } from '../../../storybook/config'
import {
  ButtonStoryblok,
  EcommerceCheckoutStoryblok,
  EcommerceFastspringConfigStoryblok,
  EcommerceFastspringProductStoryblok,
  GlobalStoryblok,
  HeadlineStoryblok,
  ImageStoryblok
} from '../../../typings/generated/components-schema'
import { LmFastSpringProvider } from './LmFastspringProvider'
import { LmAppContainer } from '../../layout/AppContainer'

const storefront = 'insidesoccer.test.onfastspring.com/popup-insidesoccer'
const accessKey = 'KZY-IFBBTXUW8QJ_WCGFGG'
const url =
  'https://d1f8f9xcsvx3ha.cloudfront.net/sbl/0.8.3/fastspring-builder.min.js'

LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)

export default {
  title: 'Ecommerce/Fastspring',
  decorators: [
    (Story: any) => {
      appContext.content.settings = {
        ...appContext.content.settings,
        ecommerce: [
          {
            _uid: '23',
            component: 'ecommerce_fastspring_config',
            data_accesss_key: accessKey,
            data_storefront: storefront,
            url
          } as EcommerceFastspringConfigStoryblok
        ]
      } as GlobalStoryblok
      return (
        <LmAppContainer content={appContext.content}>
          <Story />
        </LmAppContainer>
      )
    }
  ]
}

const integration = {
  _uid: '342',
  component: 'ecommerce_fastspring_product',
  path: 'ebook-offensive'
} as EcommerceFastspringProductStoryblok

export const CheckoutButtons = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 16 }}>
        <LmComponentRender
          content={
            {
              _uid: '123',
              component: 'ecommerce_checkout',
              integration: [integration],
              trigger: [
                {
                  _uid: '2432',
                  component: 'button',
                  label: '{price}: Buy Now !!'
                } as ButtonStoryblok
              ]
            } as EcommerceCheckoutStoryblok
          }
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <LmComponentRender
          content={
            {
              _uid: '123',
              component: 'ecommerce_checkout',
              integration: [integration],
              trigger: [
                {
                  _uid: '2432',
                  component: 'image',
                  width: 300,
                  property: ['img-thumbnail'],
                  source:
                    'https://a.storyblok.com/f/82895/1280x1044/d20df0f536/buy-now-606685_1280.png'
                } as ImageStoryblok
              ]
            } as EcommerceCheckoutStoryblok
          }
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <LmComponentRender
          content={
            {
              _uid: '123',
              component: 'ecommerce_checkout',
              integration: [integration],
              trigger: [
                {
                  _uid: '2432',
                  component: 'headline',
                  typography: 'headline2',
                  text: 'Buy Now And Fast!! only {price}'
                } as HeadlineStoryblok
              ]
            } as EcommerceCheckoutStoryblok
          }
        />
      </div>
    </div>
  )
}

export const DisplayText = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ marginBottom: 16 }}>
      <div
        dangerouslySetInnerHTML={{
          __html: 'Following terms available: {discount} {total} {price}'
        }}
      />
      <LmComponentRender
        content={
          {
            _uid: '123',
            component: 'ecommerce_checkout',
            integration: [
              {
                ...integration,
                text_only: true
              } as EcommerceFastspringProductStoryblok
            ],
            trigger: [
              {
                _uid: '2432',
                component: 'headline',
                typography: 'headline4',
                text: 'Buy Now reduced: {discount}, new price: {total}'
              } as HeadlineStoryblok
            ]
          } as EcommerceCheckoutStoryblok
        }
      />
    </div>
  </div>
)
