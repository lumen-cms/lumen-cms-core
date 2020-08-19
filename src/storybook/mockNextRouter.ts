import Router from 'next/router'

const actionWithPromise = (): Promise<boolean> => new Promise((_, reject) => reject())
const actionWithPromiseVoid = (): Promise<void> => new Promise((_, reject) => reject())

// @ts-ignore
Router.router = {
  push: actionWithPromise,
  replace: actionWithPromise,
  prefetch: actionWithPromiseVoid,
  route: '/mock-route',
  pathname: 'mock-path'
}
