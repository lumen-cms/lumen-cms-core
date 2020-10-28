import { initAuth0 } from '@auth0/nextjs-auth0'
import { AUTH0_CONFIG } from './auth0Config'

export default initAuth0({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'openid profile email',
  redirectUri: `${AUTH0_CONFIG.DOMAIN}/api/auth0/callback`,
  postLogoutRedirectUri: `${AUTH0_CONFIG.DOMAIN}/`,
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: process.env.AUTH0_COOKIE_SECRET as string,
    // The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    cookieLifetime: 60 * 60 * 8,
    // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
    // cookieDomain: 'your-domain.com',
    // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
    // cookieSameSite: 'lax',
    // (Optional) Store the id_token in the session. Defaults to false.
    storeIdToken: false,
    // (Optional) Store the access_token in the session. Defaults to false.
    storeAccessToken: false,
    // (Optional) Store the refresh_token in the session. Defaults to false.
    storeRefreshToken: false
  },
  oidcClient: {
    // (Optional) Configure the timeout in milliseconds for HTTP requests to Auth0.
    httpTimeout: 2500,
    // (Optional) Configure the clock tolerance in milliseconds, if the time on your server is running behind.
    clockTolerance: 10000
  }
})
