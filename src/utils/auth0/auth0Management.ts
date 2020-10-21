import { ManagementClient } from 'auth0'

const auth0ManagementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN as string,
  clientId: process.env.AUTH0_CLIENT_ID_MANAGEMENT,
  clientSecret: process.env.AUTH0_CLIENT_SECRET_MANAGEMENT
  // scope: 'read:users read:users_app_metadata update:current_user_metadata create:current_user_metadata read:current_user_metadata update:users update:current_user_metadata create:current_user_metadata read:current_user_metadata'
})

export default auth0ManagementClient
