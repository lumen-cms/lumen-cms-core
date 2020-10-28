import { NextApiRequest, NextApiResponse } from 'next'
import auth0 from '../../../utils/auth0/auth0'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { redirectTo } = req.query
    await auth0.handleLogin(req, res, {
      // authParams: {
      //   login_hint: 'foo@acme.com',
      //   ui_locales: 'nl',
      //   scope: 'some other scope',
      //   foo: 'bar'
      // },
      redirectTo: redirectTo as string
      // getState: (req2) => {
      //   console.log(req2)
      //   return {
      //     someValue: '123',
      //     redirectTo: '/other-url'
      //   };
      // }
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
