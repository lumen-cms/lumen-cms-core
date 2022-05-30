import { MoralisMintStoryblok } from '../../typings/generated/components-schema'

export type MoralisMintData = {
  abi: any
  merkleRoot?: string
}
export type MoralisMintProps = {
  content: MoralisMintStoryblok & {
    moralis_mint_data: MoralisMintData
  }
}

export type MoralisStripePayNowProps = MoralisMintProps & {
  mintAmount: () => number
  contractToken: string
  userToken: string
  airdropped?: string
  chainId: number
  transactionHash?: string
}
