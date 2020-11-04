import { NextApiRequest, NextApiResponse } from 'next'
import { getFastspringOrder } from '../../../utils/fastspring/fastspring'
import auth0ManagementClient from '../../../utils/auth0/auth0Management'

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const orderId = req.query.orderId as string
    if (!orderId) {
      throw new Error('Order ID is not existing')
    }
    // check if payload of fastspring is correct
    const findOrderInFastspring = await getFastspringOrder(orderId)
    // console.log(findOrderInFastspring)
    if (
      !(
        findOrderInFastspring?.reference &&
        findOrderInFastspring?.id &&
        findOrderInFastspring?.items
      )
    ) {
      throw new Error('order does not exist')
    }
    const userSub = findOrderInFastspring.tags?.sub
    if (!userSub) {
      throw new Error('user ID is not part of tags')
    }
    const oldUserData = await auth0ManagementClient.getUser({
      id: userSub
    })

    // assign role of the fastspring order to the user
    const oldPermissions = oldUserData.app_metadata?.orders || []
    const updateUserData = {
      app_metadata: {
        orders: [
          ...oldPermissions,
          ...findOrderInFastspring.items.map((path: string) => ({
            orderId: findOrderInFastspring.id,
            reference: findOrderInFastspring.reference,
            path
          }))
        ]
      }
    }
    const params = { id: userSub }
    await auth0ManagementClient.updateUser(params, updateUserData)
    res.json({ orders: updateUserData.app_metadata.orders })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
