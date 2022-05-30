import { MoralisMintProps } from './moralisTypings'

type ChainTypes = MoralisMintProps['content']['chain']
type ChainsProps = {
  // @ts-ignore
  [k in ChainTypes]: {
    name: ChainTypes
    displayName: string
    id: number
  }
}

// @ts-ignore
export const CHAINS: ChainsProps = {
  mainnet: {
    name: 'mainnet',
    displayName: 'Ethereum Mainnet',
    id: 1
  },
  rinkeby: {
    name: 'rinkeby',
    displayName: 'Rinkeby Test',
    id: 4
  },
  goerli: {
    name: 'goerli',
    displayName: 'Goerli',
    id: 5
  },
  kovan: {
    name: 'kovan',
    displayName: 'Kovan',
    id: 42
  },
  mumbai: {
    name: 'mumbai',
    displayName: 'Mumbai',
    id: 80001
  },
  polygon: {
    name: 'polygon',
    displayName: 'Polygon',
    id: 137
  },
  ropsten: {
    name: 'ropsten',
    displayName: 'Ropsten',
    id: 3
  }
}
