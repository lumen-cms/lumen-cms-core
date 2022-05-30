import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { rpcAddresses } from '../../../utils/web3/rpc'

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: rpcAddresses
    }),
  Object.keys(rpcAddresses).map((chainId) => Number(chainId))
)
