import { describe, expect, it, vi } from 'vitest'
import { ethers } from 'ethers'

vi.hoisted(() => {
  // Public test key with no funds; never read a developer or production wallet.
  process.env.SIGNER_PRIVATE_KEY = '0x' + '11'.repeat(32)
})
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
    expect(
      ethers.utils.verifyTypedData(
        {
          name: 'WhitelistToken',
          version: '1',
          chainId: 4,
          verifyingContract: '0x0e6008F3bDC0A73E8C31b43D08DB35552185fE9A'
        },
        {
          Minter: [
            { name: 'wallet', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ]
        },
        { wallet: '0x1132dB08b02D0Ac9109D82C1BA8b4Da3A8D2abFe', amount: 5 },
        signed
      )
    ).toBe(new ethers.Wallet('0x' + '11'.repeat(32)).address)
  })
})
