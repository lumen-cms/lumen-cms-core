import { MoralisMintProps } from '../moralisTypings'
import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { CHAINS } from '../chainsConfig'
import { fetchApiCall } from '../helper/fetcher'

const fetcher = (account: string, chainId: number, contractToken: string) => {
  return fetchApiCall('/api/sign/message', {
    account,
    contractAddress: contractToken,
    chainId: `${chainId}`
  })
}

export default function useWhitelist(content: MoralisMintProps['content']) {
  const { account, chainId, error } = useWeb3React()
  const selectedChain = CHAINS[content.chain || 'mainnet']
  const isCorrectChain = selectedChain?.id === chainId

  const {
    error: whitelistError,
    isValidating,
    data
  } = useSWR<{ signed: string; amount: number }>(
    (content.sale === 'whitelist' || content.sale === 'code') &&
      account &&
      isCorrectChain
      ? [account, chainId, content.contract_token]
      : null,
    fetcher,
    {
      revalidateOnFocus: false
    }
  )
  return {
    account,
    chainId,
    isCorrectChain,
    selectedChain,
    signed: data?.signed,
    maxAmountWhitelist: data?.amount,
    isValidatingWhitelist: isValidating,
    error: error || whitelistError
  }
}
