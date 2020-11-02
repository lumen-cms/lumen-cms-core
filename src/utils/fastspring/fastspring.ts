const auth = Buffer.from(
  `${process.env.FASTSPRING_USERNAME}:${process.env.FASTSPRING_PASSWORD}`
).toString('base64')
const fastspringApi = 'https://api.fastspring.com'

export const getFastspringOrder = async (path: string) => {
  const url = new URL(`${fastspringApi}/orders/${path}`)
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      'User-Agent': 'NextJS APP'
    }
  }).then((r) => r.json())
  // console.log(res)
  if (res.id && res.reference) {
    return {
      id: res.id,
      reference: res.reference,
      customer: res.customer,
      tags: res.tags,
      items: res.items.map((i: any) => i.product)
    }
  }
  return null
}
