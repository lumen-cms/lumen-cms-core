import { LmComponentRender } from '@LmComponentRender'
import { useWeb3React } from '@web3-react/core'
import {
  ButtonStoryblok,
  ImageStoryblok,
  MoralisButtonStoryblok
} from '../../typings/generated/components-schema'
import useMetaMaskOnboarding from './hooks/useMetamaskOnboarding'
import { useWeb3Connector } from './hooks/useWeb3Connector'
import { metaMask } from './connectors/metamask'

type MoralisAuthProps = {
  content: MoralisButtonStoryblok
}

const assets = {
  metamask:
    'https://cdn.jsdelivr.net/gh/MetaMask/brand-resources/SVG/metamask-fox.svg',
  walletconnect:
    'https://cdn.jsdelivr.net/gh/WalletConnect/walletconnect-assets/svg/circle/walletconnect-circle-blue.svg'
}

export default function MoralisAuth({ content }: MoralisAuthProps) {
  const { account, error, connector } = useWeb3React()
  const { isWalletConnectActivating, isMetaMaskActivating, walletConnect } =
    useWeb3Connector()
  const { isWeb3Available, startOnboarding } = useMetaMaskOnboarding()

  if (error) {
    console.log(error)
  }

  if (account) {
    let logoutElement = content.logout?.[0]
    return (
      <div>
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: 'head',
              label: 'Logout',
              ...logoutElement
            } as ButtonStoryblok | ImageStoryblok
          }
          onClick={async () => {
            // await logout()
            window.gtag &&
              gtag('event', 'logout', {
                event_category: 'Auth',
                event_label: 'Logout'
              })
            connector.deactivate()
            // await deactivate()
          }}
        />
      </div>
    )
  }

  let loginElement = content.login?.[0]
  let loginWalletElement = content.login_walletconnect?.[0]
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '12px'
      }}
    >
      <div>
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: loginElement?._uid || 'login_' + content._uid,
              image: assets.metamask,
              variant: 'outlined',
              image_size: 'medium',
              ...loginElement,
              label: 'MetaMask'
            } as ButtonStoryblok
          }
          onClick={async () => {
            if (isMetaMaskActivating) {
              return
            }
            try {
              window.gtag &&
                gtag('event', 'sign_up', {
                  event_category: 'Auth',
                  event_label: 'Login MetaMask'
                })
              if (isWeb3Available) {
                await metaMask.activate()
              } else {
                await startOnboarding()
              }
              window.gtag &&
                gtag('event', 'sign_up', {
                  event_category: 'Auth',
                  event_label: 'Login MetaMask Success'
                })
              window.fbq && fbq('track', 'Lead')
            } catch (e) {
              window.gtag &&
                gtag('event', 'exception', {
                  event_category: 'Auth',
                  event_label: 'Login MetaMask Failed'
                })
              console.log(e)
            }
          }}
        />
      </div>
      <div>
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: loginWalletElement?._uid || 'login_wallet_' + content._uid,
              image: assets.walletconnect,
              variant: 'outlined',
              image_size: 'medium',
              ...loginWalletElement,
              size: 'lm-button-large',
              label: 'WalletConnect'
            } as ButtonStoryblok
          }
          onClick={async () => {
            if (isWalletConnectActivating) {
              return
            }
            try {
              window.gtag &&
                window.gtag('event', 'sign_up', {
                  event_category: 'Auth',
                  event_label: 'Login WalletConnect'
                })

              await walletConnect.activate()
              // await activate(walletconnect, (error) => {
              //   if (error instanceof UserRejectedRequestErrorWalletConnect) {
              //     walletconnect.walletConnectProvider = null
              //   }
              // })
              window.gtag &&
                window.gtag('event', 'sign_up', {
                  event_category: 'Auth',
                  event_label: 'Login WalletConnect Success'
                })
              window.fbq && window.fbq('track', 'Lead')
            } catch (e) {
              console.log(e)
              window.gtag &&
                window.gtag('event', 'exception', {
                  event_category: 'Auth',
                  event_label: 'Login WalletConnect Failed'
                })
            }
          }}
        >
          WalletConnect
        </LmComponentRender>
      </div>
    </div>
  )
}
