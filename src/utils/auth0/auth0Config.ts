export const AUTH0_CONFIG = {
  DOMAIN:
    process.env.NODE_ENV === 'production'
      ? 'https://insidesoccercoaching.de'
      : 'https://localhost:3000'
}
