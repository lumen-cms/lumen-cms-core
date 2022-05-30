import { MoralisMintProps } from './moralisTypings'

export const getPurchaseEventData = (
  content: MoralisMintProps['content'],
  { currentCost, amount }: { amount: number; currentCost: string }
) => {
  const value = content.price_in_usd || content.price_fiat || currentCost
  const event: {
    google: Gtag.CustomParams
    facebook: facebook.Pixel.PurchaseParameters
  } = {
    google: {
      value: Number(value) * amount,
      currency: 'USD',
      event_category: 'Mint',
      items: [
        {
          id: content.contract_token,
          amount
        }
      ]
    },
    facebook: {
      value: Number(value) * amount,
      currency: 'USD'
    }
  }
  return event
}

export type MintError = {
  message: string
  code:
    | 'insufficient_fund'
    | 'not_whitelisted'
    | 'sale_not_started'
    | 'max_mint_amount_exceed'
    | 'unknown'
}

export const getMintErrorMessage = (error: any): MintError => {
  const message = error?.data?.message || error?.message || ''
  if (message.includes('insufficient funds')) {
    return {
      code: 'insufficient_fund',
      message: "You don't have enough funds in your wallet."
    }
  } else if (message.includes('Sale has not started yet')) {
    return {
      message: 'The sale has not started yet! Please come back later.',
      code: 'sale_not_started'
    }
  } else if (message.includes('max mint amount exceeded')) {
    return {
      message: 'You already minted the maximum NFTs for your wallet.',
      code: 'max_mint_amount_exceed'
    }
  } else if (message.includes('invalid proof')) {
    return {
      message:
        'You are not member of the whitelist. If you are make sure you have the right account connected.',
      code: 'not_whitelisted'
    }
  }
  return {
    message: error.message.split('(')[0],
    code: 'unknown'
  }
}
