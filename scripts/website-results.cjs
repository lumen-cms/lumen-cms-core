const fs = require('node:fs/promises')
const path = require('node:path')
const { matchReviewedRegions } = require('./website-dynamics.cjs')
const { matchSearchRegions } = require('./website-expected-changes.cjs')

// Compare health independently of pixel tolerance: identical error pages never pass.
function healthDifferences(local, live) {
  const reasons = []
  for (const capture of [local, live]) {
    if (!(capture.status >= 200 && capture.status < 300))
      reasons.push(`${capture.side}: HTTP ${capture.status ?? 'no response'}`)
    if (
      capture.fontStatus !== 'loaded' ||
      capture.fontFaces.some((f) => f.status === 'error')
    )
      reasons.push(`${capture.side}: fonts did not load`)
    if (capture.pendingImages.length)
      reasons.push(
        `${capture.side}: ${capture.pendingImages.length} images still loading`
      )
  }
  if (new URL(local.url).pathname !== new URL(live.url).pathname)
    reasons.push('Redirect destinations differ')
  if (local.title !== live.title) reasons.push('Page titles differ')
  // MUI 9 adds h3 wrappers to accordion summaries. Compare main headings;
  // preserve all heading metrics for review without treating that markup fix
  // as a content regression when the rendered page is unchanged.
  const mainHeadings = (capture) =>
    capture.headings
      .filter((h) => !h.level || h.level === 'H1' || h.level === 'H2')
      .map((h) => h.text)
  if (
    JSON.stringify(mainHeadings(local)) !== JSON.stringify(mainHeadings(live))
  )
    reasons.push('Main headings differ')
  if (local.overflow > Math.max(1, live.overflow + 1))
    reasons.push('New horizontal overflow')
  // Keep existing live errors in the report, but fail on newly introduced errors.
  const normalize = (error) => error.replace(/https?:\/\/[^\s)"']+/g, '[URL]')
  const existing = new Set(live.errors.map(normalize))
  const newErrors = local.errors.filter(
    (error) => !existing.has(normalize(error))
  )
  if (newErrors.length) reasons.push(`${newErrors.length} new browser errors`)
  const images = new Set(live.brokenImages.map((img) => img.src))
  if (local.brokenImages.some((img) => !images.has(img.src)))
    reasons.push('New broken images')
  return reasons
}

async function compareCaptures(local, live, output, key, maxDiffPercent = 0) {
  const sharp = require('sharp')
  const decoded = await Promise.all(
    [local, live].map((capture) =>
      sharp(path.join(output, capture.file))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
    )
  )
  const width = Math.max(...decoded.map((x) => x.info.width))
  const height = Math.max(...decoded.map((x) => x.info.height))
  const diff = Buffer.alloc(width * height * 4, 255)
  const reviewed = matchReviewedRegions(
    local.reviewedRegions,
    live.reviewedRegions
  )
  const expected = matchSearchRegions(
    local.expectedSearchRegions,
    live.expectedSearchRegions
  )
  reviewed.regions.push(...expected.regions)
  reviewed.issues.push(...expected.issues)
  let changed = 0,
    expectedChangePixels = 0,
    dynamicPixels = 0
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const [a, b] = decoded
      const aIndex = (y * a.info.width + x) * 4
      const bIndex = (y * b.info.width + x) * 4
      const missing =
        y >= a.info.height ||
        y >= b.info.height ||
        x >= a.info.width ||
        x >= b.info.width
      const different =
        missing ||
        [0, 1, 2].some(
          (c) => Math.abs(a.data[aIndex + c] - b.data[bIndex + c]) > 16
        )
      const index = (y * width + x) * 4
      if (different) {
        changed++
        const dynamic =
          !missing &&
          reviewed.regions.some(
            ({ rect: r }) =>
              x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height
          )
        if (dynamic) {
          dynamicPixels++
          if (
            expected.regions.some(
              ({ rect: r }) =>
                x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height
            )
          )
            expectedChangePixels++
        }
        diff[index] = dynamic ? 0 : 255
        diff[index + 1] = dynamic ? 140 : 0
        diff[index + 2] = dynamic ? 255 : 100
      } else {
        for (let c = 0; c < 3; c++)
          diff[index + c] = Math.round(a.data[aIndex + c] * 0.3 + 255 * 0.7)
      }
    }
  const changedPercent = (changed / (width * height)) * 100
  const staticChangedPercent =
    ((changed - dynamicPixels) / (width * height)) * 100
  const reasons = [...healthDifferences(local, live), ...reviewed.issues]
  if (
    decoded[0].info.width !== decoded[1].info.width ||
    decoded[0].info.height !== decoded[1].info.height
  )
    reasons.push('Screenshot dimensions differ')
  if (staticChangedPercent > maxDiffPercent)
    reasons.push(
      `${staticChangedPercent.toFixed(
        4
      )}% changed pixels (allowed ${maxDiffPercent}%)`
    )
  const diffFile = `${key}-diff.png`
  await sharp(diff, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(output, diffFile))
  return {
    status: reasons.length
      ? 'failed'
      : dynamicPixels
      ? 'dynamic-only'
      : 'passed',
    reasons,
    changedPercent,
    staticChangedPercent,
    dynamicPixels,
    expectedChangePixels,
    expectedChanges: expected.regions,
    reviewedRegions: reviewed.regions,
    heights: [local.height, live.height],
    httpStatus: [local.status, live.status],
    overflow: [local.overflow, live.overflow],
    errorCounts: [local.errors.length, live.errors.length],
    files: { local: local.file, live: live.file, diff: diffFile },
    existingLiveIssues: { errors: live.errors, brokenImages: live.brokenImages }
  }
}

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ])
  )
async function writeReport(output, results, run) {
  const passed = results.filter((row) => row.status === 'passed').length
  const dynamicOnly = results.filter(
    (row) => row.status === 'dynamic-only'
  ).length
  const failed = results.length - passed - dynamicOnly
  const summary = {
    ...run,
    completedCases: results.length,
    passed,
    dynamicOnly,
    failed,
    results
  }
  await fs.writeFile(
    path.join(output, 'summary.json'),
    JSON.stringify(summary, null, 2)
  )
  const rows = results
    .map(
      (row) => `<details ${row.status !== 'passed' ? 'open' : ''}>
    <summary class="${row.status}">${escape(
        row.status.toUpperCase()
      )} · ${escape(row.path)} · ${row.width}px · ${
        row.changedPercent?.toFixed(3) ?? '—'
      }% different</summary>
    <p>${escape([...(row.reasons || []), ...(row.errors || [])].join('; '))}</p>
    ${
      row.dynamicPixels
        ? `<p>Reviewed pixels (dynamic or approved component changes): ${
            row.dynamicPixels
          }. Approved search-change pixels: ${
            row.expectedChangePixels || 0
          }. Remaining difference: ${row.staticChangedPercent.toFixed(
            5
          )}%. ${escape(
            [...new Set(row.reviewedRegions.map((r) => r.reason))].join(' ')
          )}</p>`
        : ''
    }
    <p><a href="${escape(row.key)}.json">Capture metadata</a></p>
    ${
      row.files
        ? `<div class="images">${['live', 'local', 'diff']
            .map(
              (side) =>
                `<figure><figcaption>${side}</figcaption><a href="${escape(
                  row.files[side]
                )}"><img loading="lazy" src="${escape(
                  row.files[side]
                )}" alt="${side} ${escape(row.path)}"></a></figure>`
            )
            .join('')}</div>`
        : ''
    }
    ${
      row.existingLiveIssues?.errors.length ||
      row.existingLiveIssues?.brokenImages.length
        ? `<pre>Existing live issues: ${escape(
            JSON.stringify(row.existingLiveIssues, null, 2)
          )}</pre>`
        : ''
    }
    </details>`
    )
    .join('\n')
  await fs.writeFile(
    path.join(output, 'report.html'),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Website comparison</title>
    <style>body{font:16px system-ui;margin:24px;color:#172132;background:#f5f7fa}details{background:white;padding:16px;margin:12px 0;border:1px solid #ccd3df;border-radius:8px}summary{cursor:pointer;font-weight:600}.failed{color:#b21c34}.passed{color:#14723a}.dynamic-only{color:#0864ab}.images{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}figure{margin:0}img{width:100%;border:1px solid #ddd}figcaption{text-transform:capitalize;font-weight:600;padding:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style>
    <h1>Website comparison</h1><p>${escape(run.site || run.candidate)} · ${
      results.length
    } comparisons · ${passed} exact passes · ${dynamicOnly} dynamic-only · ${failed} failed</p>
    <p>Fresh live captures versus the candidate, in ${escape(
      run.browser
    )}. Pink marks unclassified differences; blue marks reviewed dynamic content or explicitly approved component changes. Click an image for full resolution. No baseline is automatically accepted. Dynamic exceptions require matching geometry and content/style signatures; unknown differences still fail.</p>
    <p>Allowed changed pixels: ${escape(
      run.maxDiffPercent ?? 0
    )}%. Per-channel noise threshold: 16/255. <a href="summary.json">JSON results</a></p>${rows}</html>`
  )
  return summary
}
module.exports = { healthDifferences, compareCaptures, writeReport }
