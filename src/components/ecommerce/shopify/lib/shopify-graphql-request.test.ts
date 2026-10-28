import { describe, expect, it, vi } from 'vitest'
import { shopifyGraphqlSdk } from './shopify-graphql-request'

describe('Shopify GraphQL client compatibility', () => {
  it('preserves query variables and authentication with the native fetch client', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        Response.json({ data: { product: { id: 'test-product' } } })
      )
    vi.stubGlobal('fetch', fetch)

    const sdk = shopifyGraphqlSdk({
      domain: 'shop.example.test',
      accessToken: 'test-token'
    })
    const result = await sdk.product({ handle: 'test-product' })
    expect(result).toEqual({ product: { id: 'test-product' } })
    expect(fetch).toHaveBeenCalledOnce()
    const [url, request] = fetch.mock.calls[0]
    expect(String(url)).toBe(
      'https://shop.example.test/api/2021-07/graphql.json'
    )
    expect(
      new Headers(request.headers).get('X-Shopify-Storefront-Access-Token')
    ).toBe('test-token')
    expect(JSON.parse(request.body)).toMatchObject({
      variables: { handle: 'test-product' }
    })
  })

  it('continues to reject GraphQL errors instead of returning incomplete data', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ errors: [{ message: 'Access denied' }] })
        )
    )
    const sdk = shopifyGraphqlSdk({
      domain: 'shop.example.test',
      accessToken: 'test-token'
    })
    await expect(sdk.product({ handle: 'test-product' })).rejects.toThrow(
      'Access denied'
    )
  })
})
