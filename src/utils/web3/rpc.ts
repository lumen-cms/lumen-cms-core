export const rpcAddresses = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA}`,
  4: `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA}`,
  137:
    process.env.NEXT_PUBLIC_POLYGON ||
    'https://speedy-nodes-nyc.moralis.io/5cf13d18e7267b97909eeffc/polygon/mainnet', // 'https://rpc-mainnet.maticvigil.com/', //'https://speedy-nodes-nyc.moralis.io/5cf13d18e7267b97909eeffc/polygon/mainnet',
  80001:
    process.env.NEXT_PUBLIC_MUMBAI ||
    'https://speedy-nodes-nyc.moralis.io/5cf13d18e7267b97909eeffc/polygon/mumbai' //'https://rpc-mumbai.maticvigil.com' //'https://speedy-nodes-nyc.moralis.io/5cf13d18e7267b97909eeffc/polygon/mumbai'//'https://rpc-mumbai.maticvigil.com'//'https://rpc-mumbai.matic.today'
}
