import { NextApiRequest, NextApiResponse } from 'next'
import { getFastspringOrder } from '../../../utils/fastspring/fastspring'
import { updateElasticContact } from '../../../utils/email/update-elastic-contact'
import auth0ManagementClient from '../../../utils/auth0/auth0Management'

export default async function assignFastspringElastic(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const orderId = req.query.orderId as string
    if (!orderId) {
      throw new Error('Order ID is not existing')
    }
    const findOrderInFastspring = await getFastspringOrder(orderId)

    const data = {
      email: findOrderInFastspring?.customer.email,
      given_name: findOrderInFastspring?.customer.first,
      family_name: findOrderInFastspring?.customer.last,
      phone: findOrderInFastspring?.customer.phone,
      orders: findOrderInFastspring?.items
    }

    const userSub = findOrderInFastspring?.tags?.sub
    if (userSub) {
      const oldUserData = await auth0ManagementClient.getUser({
        id: userSub
      })
      if (oldUserData) {
        data.email = oldUserData.email
        data.given_name = oldUserData.given_name
        data.family_name = oldUserData.family_name
        data.orders = [
          ...data.orders,
          ...(oldUserData.app_metadata?.orders?.map(
            (i: any) =>
              i[process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY as string] || i
          ) ?? [])
        ]
      }
    }

    const result = await updateElasticContact({
      data
    })
    res.json(result)
  } catch (error) {
    console.log('elastic error', error)
    res.status(error.status || 400).end(error.message)
  }
}
