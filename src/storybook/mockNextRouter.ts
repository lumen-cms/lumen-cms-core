import Router from 'next/router'

const actionWithPromise = (): Promise<boolean> =>
  new Promise((_, reject) => reject())
const actionWithPromiseVoid = (): Promise<void> =>
  new Promise((_, reject) => reject())

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
Router.router = {
  push: actionWithPromise,
  replace: actionWithPromise,
  prefetch: actionWithPromiseVoid,
  route: '/mock-route',
  pathname: 'mock-path',
}
