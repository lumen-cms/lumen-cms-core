import { NextApiRequest, NextApiResponse } from 'next'
import auth0 from '../../../utils/auth0/auth0'
import auth0ManagementClient from '../../../utils/auth0/auth0Management'

export default auth0.requireAuthentication(async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await auth0.getSession(req)
    const user = session?.user
    const { sub, given_name, family_name } = req.query
    if (!sub) {
      throw new Error('ID does not exist')
    }
    if (!user) {
      throw new Error('user ID does not exist')
    }
    if (sub !== user.sub) {
      throw new Error('ID is not equal')
    }
    if (!(given_name && family_name)) {
      throw new Error('Required field is missing')
    }
    const data = {
      given_name: given_name as string,
      family_name: family_name as string,
      name: `${given_name} ${family_name}`
    }
    console.log(data)
    await auth0ManagementClient.updateUser({ id: user.sub }, data)
    await auth0.handleProfile(req, res)
  } catch (error) {
    console.log(error)
    res.status(error.status || 400).end(error.message || error)
  }
})
