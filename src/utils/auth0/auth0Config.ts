export const AUTH0_CONFIG = {
  DOMAIN:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_HOSTNAME
      : 'https://localhost:3000'
}
