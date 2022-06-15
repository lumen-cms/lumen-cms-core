import { NextApiRequest, NextApiResponse } from 'next'
import { ethers, Wallet } from 'ethers'

const privKey = process.env.SIGNER_PRIVATE_KEY as string

const getSignature = (): Wallet => {
  return new ethers.Wallet(privKey)
}

const getDomainSignature = (chainId: number, contractAddress: string) => ({
  name: 'WhitelistToken',
  version: '1',
  chainId,
  verifyingContract: contractAddress
})

const signedTypedData = async (domain: any, types: any, value: any) => {
  const signature = getSignature()
  const signed = await signature._signTypedData(domain, types, value)
  return signed
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
  const signed = await signedTypedData(
    getDomainSignature(chainId, contractAddress),
    {
      Minter: [
        { name: 'wallet', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ]
    },
    {
      wallet: minterAddress,
      amount
    }
  )
  return { signed, amount }
}

export async function signMessageCodeApi(
  req: NextApiRequest,
  res: NextApiResponse,
  whitelistData: { codes: string[]; whitelistSpots: string[] }
) {
  const { account, chainId, contractAddress, code } = req.query
  console.log(account, chainId, contractAddress, code)
  if (typeof account !== 'string') {
    return {
      signed: false
    }
  }
  let found
  if (typeof code === 'string' && code.length > 1) {
    found = whitelistData.codes.some(
      (i) => i.toLowerCase() === code.toLowerCase()
    )
  } else {
    found = whitelistData.whitelistSpots.some(
      (i) => i.toLowerCase() === account.toLowerCase()
    )
  }
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  if (!(found && chainId && contractAddress && account)) {
    return { signed: false }
  }

  const mintAmount = process.env.SIGNER_CODE_MINT_AMOUNT
    ? Number(process.env.SIGNER_CODE_MINT_AMOUNT)
    : 1
  const signed = await signedTypedData(
    getDomainSignature(Number(chainId), contractAddress as string),
    {
      Minter: [
        { name: 'wallet', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'token', type: 'string' }
      ]
    },
    {
      wallet: account,
      amount: mintAmount,
      token: code || ''
    }
  )
  return {
    signed,
    amount: mintAmount,
    code: code || ''
  }
}

// handles data from etherscan exported lists
type WhitelistDataSource = { Quantity: number; HolderAddress: string }[]

export async function signMessageApi(
  req: NextApiRequest,
  res: NextApiResponse,
  whitelistData: WhitelistDataSource
) {
  const { account, chainId, contractAddress } = req.query
  if (typeof account !== 'string') {
    return {
      signed: false
    }
  }
  let amount = whitelistData.find(
    (i) => i.HolderAddress.toLowerCase() === account.toLowerCase()
  )?.Quantity
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  if (!(amount && chainId && contractAddress)) {
    return { signed: false }
  }
  return createSignedMessage({
    minterAddress: account as string,
    chainId: Number(chainId) as number,
    contractAddress: contractAddress as string,
    amount: amount
  })
}
