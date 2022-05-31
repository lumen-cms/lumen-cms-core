import { MoralisMintProps } from '../moralisTypings'
import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { CHAINS } from '../chainsConfig'

const fetcher = (account: string, chainId: number, contractToken: string) => {
  const url = `${
    process.env.STORYBOOK ? 'http://localhost:3000' : ''
  }/api/sign/message`
  const params = new URLSearchParams()
  params.append('account', account)
  params.append('chainId', `${chainId}`)
  params.append('contractAddress', contractToken)
  const fullPath = url + '?' + params.toString()
  return fetch(fullPath).then((res) => res.json())
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
    content.sale === 'whitelist' && account && isCorrectChain
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
