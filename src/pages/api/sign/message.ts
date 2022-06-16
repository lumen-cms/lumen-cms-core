import { NextApiRequest, NextApiResponse } from 'next'
import { signMessageCodeApi } from '../../../utils/web3/signMessage'
import NextCors from 'nextjs-cors'

const whitelistTests = [
  '0x50750F42bF6eee5CF734453bad96Fb87304ceE84',
  '0x0DC750443969bD9C7C8CBC61e75A2AF8bAb49A84',
  '0x101eC2b32e8d9F6DFB268E1578398f884F8a9db1',
  '0x7cf91Ed7C73458De19936503E354cF4e90a66B05',
  '0x40b38517DD35A744c8A50B6D604a085AB9Fab537',
  '0x06C7f6298C9Ca6fC5c34d795655c521b37A05204',
  '0xBb1fcF0D227341B6F36Ccf9df0576F52c01BAAE4',
  '0xe899fD2572d9f96662Fa2a9fCb708d3F78D489f1',
  '0x978324CC2426dc6dC05b6623556f3F8F47eEceE2',
  '0x7a16CfF6bF850135d9705C1bFEdd716CeC7637b4',
  '0x9D31e18ee83Cd2a2dC9c8044f811c6385347e0D3',
  '0x9807027a8EB2371b3c9F74fbC01dA58179398960',
  '0x9c76610760ceaC4b376cf3d65BE7954AE01003ba'
]

const data = {
  codes: ['abc123'],
  whitelistSpots: whitelistTests
}

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
  // const result = await signMessageApi(req, res, data)
  const result = await signMessageCodeApi(req, res, data)
  res.json(result)
}
