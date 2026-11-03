// Group audit findings by their remediation owner; preserve evidence and avoid
// treating an automated scan as either a content-source proof or conformance.
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../.website-tests/astro-accessibility')
const report = JSON.parse(fs.readFileSync(path.join(root, 'report.json'), 'utf8'))
const descriptions = {
 'color-contrast': { owner: 'Shared: Storyblok theme/content and renderer styling', action: 'Review the foreground/background pair and any opacity in failureSummary. Explicit CMS colors and theme tokens need a design decision. Components also apply variants/opacity; palette preservation prevents claiming these are fixed. No colors were changed.' },
 'heading-order': { owner: 'Storyblok content structure', action: 'Set explicit heading tags in document order (h1, h2, h3); retain typography/font/color options separately. Renderer defaults cannot infer the intended page outline.' },
 'page-has-heading-one': { owner: 'Storyblok content structure', action: 'Mark the main page title as h1 using the headline tag setting, or fix the heading tag in authored HTML. Do not insert an arbitrary hidden title.' },
 'empty-heading': { owner: 'Storyblok HTML or renderer investigation', action: 'Empty structured rich-text headings are now handled defensively. Remaining raw HTML headings should be filled or removed in Storyblok; inspect the supplied selector before assigning ownership.' },
 'link-name': { owner: 'Storyblok link content or renderer investigation', action: 'Whitespace-only structured rich-text links no longer become anchors. Remaining links need useful visible text or an authored accessible name; inspect raw HTML and custom link overrides.' },
 'link-in-text-block': { owner: 'Storyblok authored HTML/CSS or custom override', action: 'Renderer text links now have persistent underlines. Remove authored text-decoration:none for the remaining text link, or add an underline without changing its color.' },
 'frame-title': { owner: 'Storyblok raw HTML', action: 'Add a meaningful title to the iframe in the HTML block. Known cases: Bali /meeting booking frame; Upskill /contact map and Street View frames. This is not the Iframe.astro component, which supplies a title.' },
 'aria-prohibited-attr': { owner: 'Storyblok raw pricing HTML', action: 'For pricing .check/.dash spans with aria-label, add role="img" or replace the label with screen-reader text. Preserve the existing classes and colors.' },
 'landmark-main-is-top-level': { owner: 'Storyblok raw pricing HTML', action: 'Replace the nested <main class="pricing-page"> with a div retaining the same class. SiteLayout.astro already supplies the page main landmark.' },
 'landmark-no-duplicate-main': { owner: 'Storyblok raw pricing HTML', action: 'Remove the extra main landmark from the pricing HTML; retain the renderer main landmark and its skip-link target.' },
 'landmark-unique': { owner: 'Storyblok raw pricing HTML', action: 'Fix the duplicate/nested main in the pricing HTML instead of adding labels to disguise duplicate page landmarks.' },
 'scrollable-region-focusable': { owner: 'Storyblok raw pricing HTML', action: 'Give .compare-table-wrap tabindex="0", role="region", and an accessible name such as Feature comparison; retain a visible focus outline so keyboard users can scroll it.' }
}
const findings = new Map()
let states = 0
for (const page of report.reports) for (const state of page.states || []) {
 states++
 for (const rule of state.violations) for (const node of rule.nodes) {
  const key = JSON.stringify([page.site, page.route, rule.id, node.target])
  let entry = findings.get(key)
  if (!entry) {
   entry = { site: page.site, route: page.route, rule: rule.id, impact: rule.impact, ...(descriptions[rule.id] || { owner: 'Needs renderer/content investigation', action: 'Inspect the supplied markup before choosing a fix.' }), target: node.target, html: node.html, failureSummary: node.failureSummary, viewports: [], states: [] }
   findings.set(key, entry)
  }
  if (!entry.viewports.includes(page.width)) entry.viewports.push(page.width)
  if (!entry.states.includes(state.name)) entry.states.push(state.name)
 }
}
const entries = [...findings.values()].sort((a,b) => a.site.localeCompare(b.site) || a.route.localeCompare(b.route) || a.rule.localeCompare(b.rule))
const rules = Object.entries(descriptions).map(([rule, description]) => {
 const matches = entries.filter(entry => entry.rule === rule)
 return { rule, ...description, uniqueTargets: matches.length, pages: [...new Set(matches.map(entry => `${entry.site}: ${entry.route}`))] }
}).filter(rule => rule.uniqueTargets)
const result = { generated: report.generated, pageViewportCombinations: report.reports.length, states, counting: 'Unique site + route + rule + target; repeated viewport/state findings are grouped.', limits: report.limitations, rendererFixes: ['Persistent underlines on rendered rich-text/Markdown links; colors unchanged', 'Whitespace-only rich-text links render their formatting without a focusable anchor', 'Empty structured rich-text headings keep layout but are hidden from the accessibility tree', 'Initial Astro rendering and dynamically rendered story lists use the same content-presence check'], rules, findings: entries }
fs.writeFileSync(path.join(root, 'ownership.json'), JSON.stringify(result,null,2))
const byRule = Object.fromEntries(rules.map(rule => [rule.rule, rule.uniqueTargets]))
fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify({ generated: report.generated, pageViewportCombinations: report.reports.length, states, counting: result.counting, uniqueFindings: entries.length, byRule, sites: report.summary, limitations: report.limitations },null,2))
console.log(JSON.stringify({ pageViewportCombinations: report.reports.length, states, byRule },null,2))

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]))
const origins = require('../test/websites/sites.json')
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Astro accessibility: renderer and Storyblok ownership</title><style>body{font:16px/1.6 system-ui;max-width:1100px;margin:32px auto;padding:0 20px;color:#17212b;background:#fff}h1{line-height:1.2}section{border-top:1px solid #ccd3da;margin-top:24px;padding-top:12px}summary{cursor:pointer;font-weight:600}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f4f6f8;padding:12px}a{color:#0645ad}li{margin:6px 0}.note{padding:16px;background:#f4f6f8}</style><h1>Accessibility ownership</h1><p>${result.pageViewportCombinations} page/viewport combinations; ${result.states} states. ${escape(result.counting)}</p><h2>Fixed in the renderer</h2><ul>${result.rendererFixes.map(fix=>`<li>${escape(fix)}</li>`).join('')}</ul><p class="note">Site colors are unchanged. Remaining contrast findings need a design decision. ${escape(result.limits)}</p><h2>Remaining changes</h2>${rules.map(group=>`<section><h3>${escape(group.rule)} — ${group.uniqueTargets} affected targets</h3><p><strong>${escape(group.owner)}</strong></p><p>${escape(group.action)}</p><details><summary>Affected pages (${group.pages.length})</summary><ul>${group.pages.map(page=>{const [site,...parts]=page.split(': ');const route=parts.join(': ');return `<li><a href="${escape(origins[site].origin+route)}">${escape(page)}</a></li>`}).join('')}</ul></details><details><summary>Markup and selectors</summary>${entries.filter(entry=>entry.rule===group.rule).map(entry=>`<details><summary>${escape(entry.site+' '+entry.route+' — '+entry.target.join(' / '))}</summary><pre>${escape(entry.html)}</pre><pre>${escape(entry.failureSummary)}</pre><p>Widths: ${entry.viewports.join(', ')}. States: ${escape(entry.states.join(', '))}.</p></details>`).join('')}</details></section>`).join('')}</html>`
fs.writeFileSync(path.join(root, 'ownership.html'), html)
