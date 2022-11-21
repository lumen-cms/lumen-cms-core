const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const proxy = require('http-proxy')

const cert = path.join(process.cwd(), './certs/localhost.pem')
const key = path.join(process.cwd(), './certs/localhost-key.pem')

proxy
  .createServer({
    xfwd: true,
    ws: true,
    target: {
      host: 'localhost',
      port: 3001
    },
    ssl: {
      key: fs.readFileSync(key, 'utf8'),
      cert: fs.readFileSync(cert, 'utf8')
    }
  })
  .on('error', function(e) {
    console.error(chalk.red(`Request failed to proxy: ${chalk.bold(e.code)}`))
  })
  .listen(3000)
