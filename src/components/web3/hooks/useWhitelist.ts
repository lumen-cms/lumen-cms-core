import { MoralisMintProps } from '../moralisTypings'
import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { CHAINS } from '../chainsConfig'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function useWhitelist(content: MoralisMintProps['content']) {
  const { account, chainId, error } = useWeb3React()
  const selectedChain = CHAINS[content.chain || 'mainnet']
  const isCorrectChain = selectedChain?.id === chainId

  const url = `${
    process.env.STORYBOOK ? 'http://localhost:3000' : ''
  }/api/sign/${account}?chainId=${chainId}&contractAddress=${
    content.contract_token
  }`
  const {
    error: whitelistError,
    isValidating,
    data
  } = useSWR<{ signed: string; amount: number }>(
    content.sale === 'whitelist' && account && isCorrectChain ? url : null,
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
