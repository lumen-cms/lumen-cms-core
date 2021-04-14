import { createServer } from 'https'
// import { parse } from 'url'
import next from 'next'
import fs from 'fs'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev: true,
  // dir: '../src/',
  quiet: true
})
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('credentials/localhost.key'),
  cert: fs.readFileSync('credentials/localhost.crt')
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    // const parsedUrl = parse(req.url!, true)
    const parsedUrl = new URL(req.url!, 'https://w.w')

    handle(req, res, parsedUrl as any)
  }).listen(port)

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})

// import { createServer } from 'https'
// import { parse } from 'url'
// import next from 'next'

// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()

// app.prepare().then(() => {
//   createServer(httpsOptions, async (req, res) => {
//     const parsedUrl = parse(req.url as any, true)
//     await handle(req, res, parsedUrl)
//   }).listen(3000, () => {
//     console.log('> Ready on https://localhost:3000')
//   })
// })
