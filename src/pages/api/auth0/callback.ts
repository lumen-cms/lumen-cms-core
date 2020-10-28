import { NextApiRequest, NextApiResponse } from 'next'
import auth0 from '../../../utils/auth0/auth0'
import { updateElasticContact } from '../../../utils/email/update-elastic-contact'

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await auth0.handleCallback(req, res, {
      redirectTo: process.env.NEXT_PUBLIC_AUTH0_LANDING_PAGE,
      onUserLoaded: async (_req, _res, session) => {
        const { user } = session
        if (process.env.ELASTIC_EMAIL_API_KEY) {
          try {
            console.log(JSON.stringify(user, null, 2))
            const data = {
              data: {
                email: user.email,
                given_name: user.given_name,
                family_name: user.family_name,
                phone: user.phone,
                orders:
                  user[process.env.NEXT_PUBLIC_AUTH_PERMISSION as string] || '',
                lang: user[process.env.NEXT_PUBLIC_AUTH_LANG as string] || ''
              }
            }
            await updateElasticContact(data)
          } catch (e) {
            console.error(e)
          }
        }
        return session
      }
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
