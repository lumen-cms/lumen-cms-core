// Verify a real CMS fetch on first generation, using a disposable build copy.
// Run after preparing/building the snapshot pilot, outside timing benchmarks.
const fs = require('node:fs/promises')
const path = require('node:path')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { createHash } = require('node:crypto')

const repo = path.resolve(__dirname, '..')
const work = path.join(repo, '.next-reference/app-router-pilot')
const original = path.join(work, 'app')
const target = path.join(work, 'app-live')
const origin = 'http://127.0.0.1:3219'
const hash = (data) => createHash('sha256').update(data).digest('hex')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  // This directory belongs only to this check; preserve both measured builds.
  await fs.rm(target, { recursive: true, force: true })
  await fs.mkdir(target, { recursive: true })
  for (const name of [
    '.env.local',
    'next.config.js',
    'package.json',
    'content'
  ])
    await fs.cp(path.join(original, name), path.join(target, name), {
      recursive: true
    })
  await fs.cp(path.join(original, '.next'), path.join(target, '.next'), {
    recursive: true,
    filter: (source) =>
      ![
        path.join(original, '.next/cache'),
        path.join(original, '.next/server/route-cache')
      ].includes(source)
  })
  for (const name of ['node_modules', 'public'])
    await fs.symlink(path.join(repo, name), path.join(target, name), 'dir')
  // A successful response now cannot accidentally come from the snapshot.
  await fs.rm(path.join(target, 'content/imprint.json'))
  await fs.writeFile(path.join(target, 'generation.log'), '')
  const log = await fs.open(path.join(target, 'server.log'), 'w')
  const server = spawn(
    process.execPath,
    [
      path.join(repo, 'node_modules/next/dist/bin/next'),
      'start',
      '-p',
      '3219',
      '--hostname',
      '127.0.0.1'
    ],
    {
      cwd: target,
      env: { ...process.env, PILOT_CONTENT_SOURCE: 'live' },
      stdio: ['ignore', log.fd, log.fd]
    }
  )
  try {
    let ready = false
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        if ((await fetch(origin + '/privacy-policy')).ok) {
          ready = true
          break
        }
      } catch {}
      await sleep(200)
    }
    assert.ok(
      ready,
      'Live-check server did not start; inspect app-live/server.log'
    )
    assert.equal(
      await fs.readFile(path.join(target, 'generation.log'), 'utf8'),
      ''
    )
    const start = performance.now()
    const first = await fetch(origin + '/imprint')
    const html = await first.text()
    const firstGenerationMs = Math.round(performance.now() - start)
    assert.equal(
      first.status,
      200,
      'Live generation failed; inspect app-live/server.log'
    )
    assert.ok(
      /<title>Imprint\b/.test(html),
      'Expected the published imprint title'
    )
    const after = await fs.readFile(path.join(target, 'generation.log'), 'utf8')
    assert.equal(
      after,
      '/imprint\n',
      'Expected exactly one live data-loader call'
    )
    const second = await fetch(origin + '/imprint')
    assert.equal(await second.text(), html)
    assert.equal(
      await fs.readFile(path.join(target, 'generation.log'), 'utf8'),
      after
    )
    assert.equal(first.headers.get('x-nextjs-cache'), 'MISS')
    assert.equal(second.headers.get('x-nextjs-cache'), 'HIT')
    const result = {
      checkedAt: new Date().toISOString(),
      route: '/imprint',
      source: 'live published CMS',
      snapshotFileAbsent: true,
      firstStatus: first.status,
      firstCache: first.headers.get('x-nextjs-cache'),
      repeatedCache: second.headers.get('x-nextjs-cache'),
      dataLoaderCalls: 1,
      repeatedVisitCausesNoGeneration: true,
      htmlSha256: hash(html),
      firstGenerationMs
    }
    await fs.writeFile(
      path.join(work, 'results/live-check.json'),
      JSON.stringify(result, null, 2) + '\n'
    )
    console.log(JSON.stringify(result, null, 2))
  } finally {
    server.kill('SIGTERM')
    await log.close()
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
