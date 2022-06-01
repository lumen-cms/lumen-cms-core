import { NextApiRequest, NextApiResponse } from 'next'
import { ethers, Wallet } from 'ethers'

const privKey = process.env.SIGNER_PRIVATE_KEY as string // DeeJay

const getSignature = (): Wallet => {
  return new ethers.Wallet(privKey)
}

export const createSignedMessage = async ({
  contractAddress,
  minterAddress,
  chainId,
  amount
}: {
  chainId: number
  contractAddress: string
  minterAddress: string
  amount: number
}) => {
  if (!privKey) {
    console.log('no private key set')
    return {
      signed: false,
      amount: 0
    }
  }
  const domain = {
    name: 'WhitelistToken',
    version: '1',
    chainId,
    verifyingContract: contractAddress
  }

  const types = {
    Minter: [
      { name: 'wallet', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ]
  }

  const signature = getSignature()
  const signed = await signature._signTypedData(domain, types, {
    wallet: minterAddress,
    amount
  })
  return { signed, amount }
}

type WhitelistDataSource = { Quantity: number; HolderAddress: string }[]

export async function signMessageApi(
  req: NextApiRequest,
  res: NextApiResponse,
  maikoWhitelistData: WhitelistDataSource
) {
  const { account, chainId, contractAddress } = req.query
  if (typeof account !== 'string') {
    return {
      signed: false
    }
  }
  let amount = maikoWhitelistData.find(
    (i) => i.HolderAddress.toLowerCase() === account.toLowerCase()
  )?.Quantity
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  if (!(amount && account && chainId && contractAddress)) {
    return { signed: false }
  }
  return createSignedMessage({
    minterAddress: account as string,
    chainId: Number(chainId) as number,
    contractAddress: contractAddress as string,
    amount: amount
  })
}
