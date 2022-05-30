import { NextApiRequest, NextApiResponse } from 'next'
import { signMessageApi } from '../../../utils/web3/signMessage'
import NextCors from 'nextjs-cors'

const data = [
  {
    HolderAddress: '0x1132dB08b02D0Ac9109D82C1BA8b4Da3A8D2abFe',
    Quantity: 5
  }
]

export default async function signApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== 'production') {
    await NextCors(req, res, {
      methods: ['GET'],
      origin: '*',
      optionsSuccessStatus: 200
    })
  }
  const result = await signMessageApi(req, res, data)
  res.json(result)
}
