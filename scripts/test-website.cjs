// Build the actual consumer with the current core, then compare fresh live pages.
const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const net = require('node:net')
const os = require('node:os')
const { spawn } = require('node:child_process')
const { parseArgs } = require('node:util')
const sites = require('../test/websites/sites.json')
const root = path.resolve(__dirname, '..')
const children = new Set()
const kill = (child, signal = 'SIGTERM') => {
  if (child.exitCode !== null || child.signalCode !== null) return
  try {
    if (process.platform === 'win32') child.kill(signal)
    else process.kill(-child.pid, signal)
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    for (const child of children) kill(child, signal)
    process.exit(signal === 'SIGINT' ? 130 : 143)
  })
function launch(args, cwd, env, log) {
  const child = spawn(process.execPath, args, {
    cwd,
    env,
    detached: process.platform !== 'win32',
    stdio: log ? ['ignore', log, log] : 'inherit'
  })
  children.add(child)
  child.once('exit', () => children.delete(child))
  return child
}
async function command(args, cwd, env, logPath) {
  const log = logPath ? await fs.open(logPath, 'a', 0o600) : null
  try {
    const child = launch(args, cwd, env, log?.fd)
    const code = await new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('exit', (status) => resolve(status ?? 1))
    })
    if (code !== 0)
      throw new Error(
        `Command failed (${code}). ${logPath ? `See ${logPath}` : ''}`
      )
  } finally {
    await log?.close()
  }
}
async function unusedPort() {
  const server = net.createServer()
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const { port } = server.address()
  await new Promise((resolve) => server.close(resolve))
  return port
}
async function ready(origin, server) {
  const deadline = Date.now() + 120000
  while (Date.now() < deadline) {
    if (server.exitCode !== null || server.signalCode !== null)
      throw new Error('Local server exited; inspect server.log')
    try {
      const response = await fetch(origin, {
        signal: AbortSignal.timeout(10000),
        redirect: 'manual'
      })
      await response.body?.cancel()
      if (response.status >= 200 && response.status < 400) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(
    'Local server did not become ready within 120 seconds; inspect server.log'
  )
}
async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      list: { type: 'boolean' },
      help: { type: 'boolean' },
      'keep-work': { type: 'boolean', default: false },
      'websites-root': {
        type: 'string',
        default: process.env.WEBSITE_CONSUMERS_ROOT || '../websites'
      },
      'base-url': { type: 'string' },
      limit: { type: 'string' },
      widths: { type: 'string', default: '1280,375' },
      workers: { type: 'string', default: '2' },
      'max-diff-percent': { type: 'string', default: '0' }
    }
  })
  if (values.help) {
    console.log(
      'Usage: pnpm test:website <bali|planet|upskill> [--list] [--limit N] [--widths 1280,375] [--workers 2] [--websites-root ../websites] [--base-url http://127.0.0.1:PORT] [--max-diff-percent 0] [--keep-work]'
    )
    return
  }
  const [site] = positionals
  if (positionals.length !== 1 || !Object.hasOwn(sites, site))
    throw new Error('Choose bali, planet or upskill. Use --help for options.')
  const profile = sites[site]
  const limit = Number(values.limit ?? profile.routes.length)
  const widths = values.widths.split(',').map(Number)
  const tolerance = Number(values['max-diff-percent'])
  const workers = Number(values.workers)
  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > profile.routes.length ||
    widths.some((w) => !Number.isInteger(w) || w < 320 || w > 1920) ||
    new Set(widths).size !== widths.length ||
    !Number.isInteger(workers) ||
    workers < 1 ||
    workers > 3 ||
    !Number.isFinite(tolerance) ||
    tolerance < 0 ||
    tolerance > 100
  )
    throw new Error(
      'Invalid limit, widths, workers (1–3), or max-diff-percent (0–100)'
    )
  const routes = profile.routes.slice(0, limit)
  let origin = values['base-url']
  if (origin) {
    const url = new URL(origin)
    if (
      url.protocol !== 'http:' ||
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      throw new Error(
        '--base-url must be a loopback HTTP origin without a path'
      )
    origin = url.origin
  }
  if (values.list) {
    console.log(
      JSON.stringify(
        {
          site,
          live: profile.origin,
          routes,
          widths,
          comparisons: routes.length * widths.length
        },
        null,
        2
      )
    )
    return
  }
  // Fail before packing/installing if the one-time browser setup is missing.
  const { chromium } = require('playwright')
  try {
    await fs.access(chromium.executablePath())
  } catch {
    throw new Error('Chromium is missing. Run pnpm test:website:install first.')
  }
  const source = path.resolve(root, values['websites-root'])
  if (!origin)
    await fs.access(
      path.join(source, 'packages', profile.consumer, 'package.json')
    )
  const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto
    .randomBytes(3)
    .toString('hex')}`
  const output = path.join(root, '.website-tests', 'results', site, runId)
  // Keep mutable dependency caches outside the tree traversed by `pnpm pack`.
  // Otherwise concurrent site runs can race with another consumer's install.
  const work = await fs.mkdtemp(
    path.join(os.tmpdir(), `lumen-website-${site}-`)
  )
  await fs.mkdir(output, { recursive: true })
  await fs.chmod(work, 0o700)
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1'
  }
  delete env.ANALYZE
  delete env.STORYBOOK
  delete env.NEXT_PUBLIC_PREVIEW_MODE
  let server, serverLog
  try {
    let candidate = 'external-local-server (caller-managed build)'
    if (!origin) {
      console.log(
        `[${site}] Packing current core and preparing ${profile.consumer}…`
      )
      const archive = path.join(work, 'candidate.tgz')
      await command(
        [
          path.join(
            path.dirname(path.join(root, 'node_modules/pnpm/package.json')),
            require(path.join(root, 'node_modules/pnpm/package.json')).bin.pnpm
          ),
          'pack',
          '--out',
          archive
        ],
        root,
        env,
        path.join(output, 'pack.log')
      )
      candidate = crypto
        .createHash('sha256')
        .update(await fs.readFile(archive))
        .digest('hex')
      const workspace = path.join(work, 'consumer')
      await command(
        [
          path.join(root, 'scripts/prepare-consumer-verification.cjs'),
          source,
          workspace,
          archive,
          profile.consumer
        ],
        root,
        env,
        path.join(output, 'prepare.log')
      )
      const pnpm = path.join(
        path.dirname(path.join(root, 'node_modules/pnpm/package.json')),
        require(path.join(root, 'node_modules/pnpm/package.json')).bin.pnpm
      )
      console.log(`[${site}] Installing the candidate in an isolated consumer…`)
      await command(
        [pnpm, 'install', '--no-frozen-lockfile'],
        workspace,
        { ...env, NODE_ENV: 'development' },
        path.join(output, 'install.log')
      )
      const consumer = path.join(workspace, 'packages', profile.consumer)
      // TEST only limits prerendering; next start still serves published content.
      // Blocking fallback generates every selected route on its first request.
      const buildEnv = { ...env, TEST: 'TRUE', NEXT_FALLBACK_MODE: 'blocking' }
      console.log(
        `[${site}] Type-checking and building production pages (remaining routes render on demand)…`
      )
      await command(
        [pnpm, 'run', 'build'],
        consumer,
        buildEnv,
        path.join(output, 'build.log')
      )
      const port = await unusedPort()
      origin = `http://127.0.0.1:${port}`
      serverLog = await fs.open(path.join(output, 'server.log'), 'a', 0o600)
      server = launch(
        [
          require.resolve('next/dist/bin/next', { paths: [consumer] }),
          'start',
          '-p',
          String(port),
          '--hostname',
          '127.0.0.1'
        ],
        consumer,
        buildEnv,
        serverLog.fd
      )
      server.once('error', (error) => console.error(error.message))
      await ready(origin, server)
    }
    const inventory = {
      routes: routes.map((route) => ({
        id: `${site}-${crypto
          .createHash('sha1')
          .update(route)
          .digest('hex')
          .slice(0, 10)}`,
        site,
        path: route,
        locale: /^\/(de|id|it|es)(\/|$)/.exec(route)?.[1] || 'en',
        live: profile.origin + route,
        local: origin + route
      }))
    }
    const inventoryFile = path.join(output, 'inventory.json')
    await fs.writeFile(inventoryFile, JSON.stringify(inventory, null, 2))
    await fs.writeFile(
      path.join(output, 'candidate.json'),
      JSON.stringify(
        {
          site,
          candidate,
          source: origin,
          createdAt: new Date().toISOString(),
          routes: routes.length,
          widths,
          sampledProductionBuild: !values['base-url'],
          ...(values['keep-work'] && { workspace: path.join(work, 'consumer') })
        },
        null,
        2
      )
    )
    console.log(
      `[${site}] Comparing ${routes.length} routes × ${widths.length} viewports against ${profile.origin}`
    )
    console.log(`Results: ${output}`)
    await command(
      [
        path.join(root, 'scripts/visual-site-audit.cjs'),
        '--inventory',
        inventoryFile,
        '--output',
        output,
        '--candidate',
        candidate,
        '--tooling',
        root,
        '--local-origin',
        origin,
        '--widths',
        values.widths,
        '--workers',
        values.workers,
        '--settle-ms',
        '150',
        '--freeze-swipers',
        '--max-diff-percent',
        values['max-diff-percent'],
        '--strict',
        '--run'
      ],
      root,
      env
    )
  } finally {
    if (server) {
      kill(server)
      await Promise.race([
        new Promise((resolve) =>
          server.exitCode !== null || server.signalCode !== null
            ? resolve()
            : server.once('exit', resolve)
        ),
        new Promise((resolve) => setTimeout(resolve, 5000))
      ])
      kill(server, 'SIGKILL')
    }
    await serverLog?.close()
    if (values['keep-work'])
      console.log(`Retained diagnostic workspace: ${work}`)
    else await fs.rm(work, { recursive: true, force: true })
    console.log(`Results and logs: ${output}`)
  }
}
main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
