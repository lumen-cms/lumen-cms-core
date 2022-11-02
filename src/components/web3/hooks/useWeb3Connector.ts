import { hooks as metaMaskHooks, metaMask } from '../connectors/metamask'
import {
  hooks as walletConnectHooks,
  walletConnect
} from '../connectors/walletconnect'

const {
  useProvider: useMetaMaskProvider,
  useIsActivating: useIsMetaMaskActivating,
  useIsActive: useIsMetaMaskActive
} = metaMaskHooks

const {
  useProvider: useWalletConnectProvider,
  useIsActivating: useIsWalletConnectActivating,
  useIsActive: useIsWalletConnectActive
} = walletConnectHooks

export function useWeb3Connector(): any {
  // MetaMask
  const isMetaMaskActivating = useIsMetaMaskActivating()
  const isMetaMaskActive = useIsMetaMaskActive()
  const metaMaskProvider = useMetaMaskProvider()

  // Wallet Connect
  const isWalletConnectActivating = useIsWalletConnectActivating()
  const isWalletConnectActive = useIsWalletConnectActive()
  const walletConnectProvider = useWalletConnectProvider()

  return {
    metaMaskProvider,
    walletConnectProvider,
    isMetaMaskActivating,
    isWalletConnectActivating,
    isMetaMaskActive,
    isWalletConnectActive,
    walletConnect,
    metaMask
  }
}
