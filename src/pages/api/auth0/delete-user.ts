import { NextApiRequest, NextApiResponse } from 'next'
import auth0 from '../../../utils/auth0/auth0'
import auth0ManagementClient from '../../../utils/auth0/auth0Management'

export default auth0.requireAuthentication(async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await auth0.getSession(req)
    const user = session?.user
    const { sub } = req.query
    if (!sub) {
      throw new Error('ID does not exist')
    }
    if (!user) {
      throw new Error('user ID does not exist')
    }
    if (sub !== user.sub) {
      throw new Error('ID is not equal')
    }
    await auth0ManagementClient.deleteUser({ id: user.sub })
    res.status(200).json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(error.status || 400).end(error.message || error)
  }
})
