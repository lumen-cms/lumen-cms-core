import { NextApiRequest, NextApiResponse } from 'next'
import { getFastspringOrder } from '../../../utils/fastspring/fastspring'
import { updateElasticContact } from '../../../utils/email/update-elastic-contact'
import auth0 from '../../../utils/auth0/auth0'

export default async function assignFastspringElastic(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const orderId = req.query.orderId as string
    if (!orderId) {
      throw new Error('Order ID is not existing')
    }
    const session = await auth0.getSession(req)
    const user = session?.user
    const findOrderInFastspring = await getFastspringOrder(orderId)

    const result = await updateElasticContact({
      data: {
        email: user?.email || findOrderInFastspring?.customer.email,
        given_name: user?.given_name || findOrderInFastspring?.customer.first,
        family_name: user?.family_name || findOrderInFastspring?.customer.last,
        phone: findOrderInFastspring?.customer.phone,
        orders: findOrderInFastspring?.items
      }
    })
    res.json(result)
  } catch (error) {
    console.log('elastic error', error)
    res.status(error.status || 400).end(error.message)
  }
}
