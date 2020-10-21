// @ts-ignore
const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./credentials/localhost.key'),
  cert: fs.readFileSync('./credentials/localhost.crt')
}

app.prepare().then(() => {
  // @ts-ignore
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)

  }).listen(3000, (err: any) => {
    if (err) throw err
    console.log('> Ready on https://localhost:3000')
  })
})
