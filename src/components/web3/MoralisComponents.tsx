import { LmCoreComponents } from '@CONFIG'
import Web3Provider from './Web3Provider'
import dynamic from 'next/dynamic'

LmCoreComponents.moralis = dynamic(
  () => import(/* webpackChunkName: 'web3' */ './MoralisContent'),
  {
    ssr: false
  }
)
LmCoreComponents.moralis_button = dynamic(
  () => import(/* webpackChunkName: 'web3' */ './MoralisAuth'),
  {
    ssr: false
  }
)
LmCoreComponents.moralis_mint = dynamic(
  () => import(/* webpackChunkName: 'web3' */ './MoralisMint'),
  {
    ssr: false
  }
)

LmCoreComponents.lm_app_providers.push(Web3Provider)
