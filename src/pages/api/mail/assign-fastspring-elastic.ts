import { NextApiRequest, NextApiResponse } from 'next'
import { getFastspringOrder } from '../../../utils/fastspring/fastspring'
import { updateElasticContact } from '../../../utils/email/update-elastic-contact'

export default async function assignFastspringElastic(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const orderId = req.query.orderId as string
    const locale = req.query.locale as string
    if (!orderId) {
      throw new Error('Order ID is not existing')
    }
    const findOrderInFastspring = await getFastspringOrder(orderId)

    const result = await updateElasticContact({
      data: {
        email: findOrderInFastspring?.customer.email,
        given_name: findOrderInFastspring?.customer.first,
        family_name: findOrderInFastspring?.customer.last,
        phone: findOrderInFastspring?.customer.phone,
        orders: findOrderInFastspring?.items,
        lang: locale
      }
    })
    res.json(result)
  } catch (error) {
    console.log('elastic error', error)
    res.status(error.status || 400).end(error.message)
  }
}
