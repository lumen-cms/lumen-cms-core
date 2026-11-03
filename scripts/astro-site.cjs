const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const dotenv = require('dotenv')
const { consumerRedirects } = require('./consumer-redirects.cjs')
const { migrateConsumerEnv } = require('./consumer-env.cjs')
const sites = require('../test/websites/sites.json')
const cms = process.argv[2] === '--cms'
const [site, command = 'build', ...args] = cms
  ? [process.argv[3], 'dev', ...process.argv.slice(4)]
  : process.argv.slice(2)
if (!sites[site] || !['build', 'dev', 'preview', 'inventory'].includes(command)) {
  throw new Error('Usage: pnpm astro:site <bali|planet|upskill> <build|dev|preview|inventory> [Astro args], or pnpm astro:cms <bali|planet|upskill> [Astro args]')
}
const root = path.resolve(__dirname, '..')
const consumer = path.resolve(process.env.WEBSITE_CONSUMERS_ROOT || path.join(root, '../websites'), 'packages', sites[site].consumer)
const env = {}
for (const name of ['.env', '.env.local']) {
  const file = path.join(consumer, name)
  if (fs.existsSync(file)) Object.assign(env, dotenv.parse(migrateConsumerEnv(fs.readFileSync(file, 'utf8'))))
}
// Match the existing Next.js site commands while retaining consumer defaults.
if (cms) {
  const file = path.join(root, `.env.${site}`)
  if (fs.existsSync(file)) Object.assign(env, dotenv.parse(migrateConsumerEnv(fs.readFileSync(file, 'utf8'))))
}
const sample = args.includes('--sample')
if (sample && command === 'dev') console.info('Astro dev exposes the full site for navigation; --sample only limits builds and inventories.')
const limitArg = args.find(arg => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : sites[site].routes.length
if (!Number.isInteger(limit) || limit < 1) throw new Error('--limit must be a positive integer')
const runtimeEnv = {
  ...env, ...process.env,
  ASTRO_TELEMETRY_DISABLED: '1',
  NODE_ENV: command === 'dev' ? 'development' : 'production',
  LUMEN_SITE: site,
  LUMEN_LINK_REDIRECTS: process.env.LUMEN_LINK_REDIRECTS || JSON.stringify(consumerRedirects(consumer)),
  LUMEN_PUBLIC_DIR: process.env.LUMEN_PUBLIC_DIR || (fs.existsSync(path.join(consumer, 'public')) ? path.join(consumer, 'public') : path.join(root, 'public')),
  LUMEN_SITE_URL: sites[site].origin,
  LUMEN_LOCALES: { bali: 'en,de,id', planet: 'en,de,it,es', upskill: 'en,de' }[site],
  ...(sample ? { LUMEN_SAMPLE_ROUTES: JSON.stringify(sites[site].routes.slice(0, limit)) } : {})
}
if (!runtimeEnv.NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY) throw new Error(`Missing published credential in ${consumer}`)
if (cms && !runtimeEnv.STORYBLOK_PREVIEW_TOKEN) throw new Error(`Missing STORYBLOK_PREVIEW_TOKEN in .env.${site} or ${consumer}`)
const executable = command === 'inventory' ? process.execPath : 'pnpm'
const commandArgs = command === 'inventory' ? [path.join(__dirname, 'astro-inventory.cjs')] : ['--filter', 'lumen-cms-astro', command, ...(cms ? ['--config', 'astro.cms.config.mjs'] : []), ...args.filter(a => a !== '--sample' && !a.startsWith('--limit='))]
const result = spawnSync(executable, commandArgs, { cwd: root, env: runtimeEnv, stdio: 'inherit' })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
