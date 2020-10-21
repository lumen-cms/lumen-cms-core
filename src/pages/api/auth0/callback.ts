import { NextApiRequest, NextApiResponse } from 'next'
import auth0 from '../../../utils/auth0/auth0'

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await auth0.handleCallback(req, res, {
      redirectTo: '/auth/dashboard'
      // onUserLoaded: async (req, res, session, state) => {
      //   return {
      //     ...session,
      //     user: {
      //       ...session.user,
      //       age: 20
      //     }
      //   };
      // }
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
