import { FC } from 'react'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
// import { ethers } from 'ethers'
import { hooks as metaMaskHooks, metaMask } from './connectors/metamask'
import {
  hooks as walletConnectHooks,
  walletConnect
} from './connectors/walletconnect'

const connectors: [
  MetaMask | WalletConnect /*| CoinbaseWallet | Network*/,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks]
  // [coinbaseWallet, coinbaseWalletHooks],
  // [network, networkHooks]
]

const Web3Provider: FC = ({ children }) => {
  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  )
}
export default Web3Provider
