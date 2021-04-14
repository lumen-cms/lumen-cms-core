const fs = require('fs')
const { createServer } = require('https')
const next = require('next')
const { parse } = require('url')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const httpsOptions = {
  key: fs.readFileSync('credentials/localhost.key'),
  cert: fs.readFileSync('credentials/localhost.crt')
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    // const parsedUrl = new URL(req.url, 'http://w.w')
    const parsedUrl = parse(req.url, true)

    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on https://localhost:${port}`)
  })
})
