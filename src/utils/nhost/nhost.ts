import nhost from 'nhost-js-sdk'

const config = {
  base_url: process.env.NEXT_PUBLIC_NHOST_BACKEND as string
}

nhost.initializeApp(config)
const auth = nhost.auth()
const storage = nhost.storage()

export { auth, storage }
