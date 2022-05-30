import { createSignedMessage } from './signMessage'

describe('Sign web3 message', function () {
  it('should successful sign message', async () => {
    const { signed, amount } = await createSignedMessage({
      contractAddress: '0x0e6008F3bDC0A73E8C31b43D08DB35552185fE9A',
      amount: 5,
      minterAddress: '0x1132dB08b02D0Ac9109D82C1BA8b4Da3A8D2abFe',
      chainId: 4
    })
    expect(amount).toEqual(5)
    expect(typeof signed).toEqual('string')
  })
})
