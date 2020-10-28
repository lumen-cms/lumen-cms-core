import { NextApiRequest, NextApiResponse } from 'next'
import auth0 from '../../../utils/auth0/auth0'
import { getFastspringOrder } from '../../../utils/fastspring/fastspring'
import auth0ManagementClient from '../../../utils/auth0/auth0Management'

export default auth0.requireAuthentication(async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await auth0.getSession(req)
    const user = session?.user
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
    if (!user) {
      throw new Error('user is not logged in')
    }

    // assign role of the fastspring order to the user
    const oldPermissions =
      user[process.env.NEXT_PUBLIC_AUTH_PERMISSION as string] || []
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
    const params = { id: user.sub }
    await auth0ManagementClient.updateUser(params, updateUserData)
    res.json({ orders: updateUserData.app_metadata.orders })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
})
