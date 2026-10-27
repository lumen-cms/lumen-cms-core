// Generate a local, read-only viewer. Screenshots and per-case JSON stay beside
// the report; no remote scripts, analytics, uploads, or baseline changes.
const fs = require('node:fs')
const path = require('node:path')
const [rootArg] = process.argv.slice(2)
if (!rootArg) throw new Error('Usage: node scripts/visual-audit-report.cjs <audit directory>')
const root = path.resolve(rootArg)
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'inventory.json'), 'utf8'))
const sources = ['automated', 'v7', 'additional', 'retries', 'final', 'verification', 'closure', 'forms-v9']
const results = new Map()
for (const source of sources) {
  const file = path.join(root, source, 'results.jsonl')
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean)) {
    const result = JSON.parse(line)
    if (!/^[a-z0-9-]+$/.test(result.key)) throw new Error('Invalid screenshot key')
    const old = results.get(result.key)
    if (!old || result.status !== 'failed' || old.status === 'failed') {
      results.set(result.key, { ...result, source })
    }
  }
}
let reviews = {}
const reviewFile = path.join(root, 'reviews.json')
if (fs.existsSync(reviewFile)) reviews = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
const rows = [...results.values()].map((r) => {
  const review = reviews[r.key]
  return { ...r, review: review && review.source === r.source &&
    review.completedAt === r.completedAt ? review : undefined }
})
const planned = inventory.routes.flatMap((r) => [1280, 375]
  .filter((w) => !r.previousWidths?.includes(w))
  .map((width) => ({ site: r.site, locale: r.locale, path: r.path, width, key: `${r.id}-${width}` })))
const pending = planned.filter((r) => !results.has(r.key) || results.get(r.key).status === 'failed')
const summary = {
  generatedAt: new Date().toISOString(),
  inventoryRoutes: inventory.routes.length,
  plannedCases: planned.length,
  pendingOriginalCases: pending.length,
  checkedRoutes: new Set(rows.filter((r) => r.status !== 'failed').map((r) => `${r.site}:${r.path}`)).size,
  completedCases: rows.length,
  status: rows.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a }, {}),
  sites: Object.fromEntries(['bali', 'planet', 'upskill'].map((s) => [s, rows.filter((r) => r.site === s).length])),
  reviewedDifferences: rows.filter((r) => r.review).length
}
fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify(summary, null, 2))
fs.writeFileSync(path.join(root, 'pending.json'), JSON.stringify(pending, null, 2))
fs.writeFileSync(path.join(root, 'report-data.json'), JSON.stringify({ summary, rows }))
const navigation = new Map()
for (const source of ['navigation', 'navigation-v2', 'navigation-v8']) {
  const file = path.join(root, source, 'results.json')
  if (!fs.existsSync(file)) continue
  const findingsFile = path.join(root, source, 'reviews.json')
  const findings = fs.existsSync(findingsFile) ? JSON.parse(fs.readFileSync(findingsFile, 'utf8')) : {}
  for (const page of JSON.parse(fs.readFileSync(file, 'utf8'))) {
    for (const comparison of page.comparisons) {
      const state = comparison.state || 'default'
      const label = comparison.label || page.label
      const pair = page.captures.filter((c) => c.file && (comparison.state
        ? c.state === comparison.state : c.index === comparison.index))
      if (pair.length !== 2) continue
      const key = [page.site, page.locale, page.width, label, state].join('|')
      navigation.set(key, {
        site: page.site, locale: page.locale, width: page.width, label, state,
        candidate: source === 'navigation-v8' ? 'drawer-accordion-v8' : 'accordion-v7',
        source, ...comparison, review: findings[comparison.key],
        captures: Object.fromEntries(pair.map((c) => [c.side, `${source}/${c.file}`]))
      })
    }
  }
}
fs.writeFileSync(path.join(root, 'navigation-report-data.json'), JSON.stringify([...navigation.values()]))
fs.writeFileSync(path.join(root, 'navigation.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Navigation comparisons</title><style>body{font:15px system-ui;color:#18273c;background:#f4f6fa;margin:28px}a{color:#175f9e}table{border-collapse:collapse;background:white;width:100%}td,th{text-align:left;padding:10px;border-bottom:1px solid #d9e1eb}button{cursor:pointer;padding:7px;background:white;border:1px solid #bbc7d5;border-radius:5px}#pair{display:flex;gap:16px;align-items:start;overflow:auto;margin:18px 0}figure{margin:0;max-width:50%}img{max-width:100%;height:auto}figcaption{padding:8px 0;font-weight:bold}#note{max-width:1000px;line-height:1.5}#view{background:white;padding:16px;border:1px solid #bbc7d5}</style><a href="report.html">Back to full-page audit</a><h1>Navigation, focus and hover</h1><p id="summary"></p><section id="view" hidden><h2 id="title"></h2><p id="note"></p><div id="pair"><figure><figcaption>Live</figcaption><img id="live" alt="Live navigation"></figure><figure><figcaption>Local</figcaption><img id="local" alt="Local navigation"></figure></div></section><table><thead><tr><th>Site / locale</th><th>Width</th><th>Menu / state</th><th>Outcome</th><th>Candidate</th><th>Evidence</th></tr></thead><tbody></tbody></table><script>fetch('navigation-report-data.json').then(r=>r.json()).then(rows=>{document.querySelector('#summary').textContent=rows.length+' menu states · '+rows.filter(r=>r.pixelIdentical).length+' pixel-identical · '+rows.filter(r=>r.review).length+' reviewed differences. Desktop menus and all configured locale drawers are represented.';for(const r of rows){const tr=document.createElement('tr');for(const text of [r.site+' / '+r.locale,r.width,r.label+' / '+r.state,r.pixelIdentical?'pixel-identical':r.review?.status||'needs review',r.candidate]){const td=document.createElement('td');td.textContent=text;tr.append(td)}const td=document.createElement('td'),button=document.createElement('button');button.textContent='Compare';button.onclick=()=>{document.querySelector('#view').hidden=false;document.querySelector('#title').textContent=r.site+' / '+r.locale+' · '+r.label+' · '+r.state;document.querySelector('#note').textContent=r.review?.note||(r.pixelIdentical?'Every screenshot pixel matches.':'Review the raw captures.');document.querySelector('#live').src=r.captures.live;document.querySelector('#local').src=r.captures.local;document.querySelector('#view').scrollIntoView()};td.append(button);tr.append(td);document.querySelector('tbody').append(tr)}})</script></html>`)
fs.writeFileSync(path.join(root, 'report.html'), `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Three-site visual audit</title>
<style>
body{margin:0;color:#18273c;background:#f4f6fa;font:15px system-ui,sans-serif}header{padding:24px 32px;background:#162b44;color:white}h1{margin:0 0 10px;font-size:25px}p{margin:8px 0;max-width:1000px;line-height:1.5}main{padding:24px 32px}button,select,input{font:inherit;padding:8px;border:1px solid #bbc7d5;border-radius:5px}button{cursor:pointer;background:white;color:#174873}nav{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.counts{display:flex;gap:12px;flex-wrap:wrap}.count{background:white;border:1px solid #d4dce8;border-radius:8px;padding:14px 20px}.count strong{display:block;font-size:25px}table{border-collapse:collapse;background:white;width:100%;font-size:13px}td,th{text-align:left;padding:10px;border-bottom:1px solid #e1e6ef;overflow-wrap:anywhere}th{background:#e5ebf3}tr:hover{background:#f2f8ff}.exact{color:#16603f}.warn{color:#934800}#viewer{background:white;border:1px solid #bbc7d5;padding:16px;margin:20px 0}#panes{display:flex;gap:12px}figure{margin:0;min-width:0;flex:1}figcaption{font-weight:bold;margin:10px 0}.scroll{max-height:76vh;overflow:auto;background:#ddd}img{display:block;width:100%;height:auto}.meta{font-size:13px;color:#465970}a{color:#175f9e}header a{color:#b4e3ff}#selected{overflow-wrap:anywhere}summary{cursor:pointer}#notes{white-space:pre-wrap}
</style>
<header><h1>Three-site visual audit</h1><p>Live sites compared with isolated production consumers using each website’s own environment. Desktop: 1280 px. Mobile: 375 px. Raw captures are retained.</p><p>A pixel difference is a review flag, not an accepted baseline. This report distinguishes exact matches, reviewed dynamic content, confirmed fixes, and unresolved cases.</p><p><a href="navigation.html">Navigation, keyboard focus and hover comparisons</a></p></header>
<main><div id="counts" class="counts"></div><p id="scope" class="meta"></p>
<nav><select id="site"><option value="">All sites</option><option>bali</option><option>planet</option><option>upskill</option></select><select id="status"><option value="">All outcomes</option><option value="pending-review">Needs review</option><option value="pixel-identical">Pixel-identical</option><option value="reviewed">Reviewed differences</option><option value="failed">Failed captures</option><option value="geometry-difference">Geometry differences</option><option value="matching-http-error">Matching HTTP errors</option></select><input id="query" placeholder="Filter route or locale"><button id="refresh">Reload results</button></nav>
<section id="viewer" hidden><button id="close">Close comparison</button><h2 id="selected"></h2><p id="notes"></p><p id="details" class="meta"></p><nav><label>Jump to vertical pixel <input id="jump" type="number" min="0" step="200" value="0" style="width:100px"></label><button id="go">Jump</button><a id="json">Capture metadata</a></nav><div id="panes"><figure><figcaption>Live</figcaption><div class="scroll"><img id="live" alt="Live site screenshot"></div></figure><figure><figcaption>Local candidate</figcaption><div class="scroll"><img id="local" alt="Local site screenshot"></div></figure></div></section>
<p id="visible" class="meta"></p><table><thead><tr><th>Site / locale</th><th>Route</th><th>Width</th><th>Outcome</th><th>Changed pixels</th><th>Candidate</th><th>Evidence</th></tr></thead><tbody id="rows"></tbody></table></main>
<script>
const $=s=>document.querySelector(s);let data,selected;
function td(row,text){const cell=document.createElement('td');cell.textContent=text;row.append(cell);return cell}
function render(){const s=data.summary;$('#counts').replaceChildren();for(const [label,n] of [['Completed comparisons',s.completedCases],['Remaining original cases',s.pendingOriginalCases],['Pixel-identical',s.status['pixel-identical']||0],['Reviewed differences',s.reviewedDifferences],['Failed captures',s.status.failed||0]]){const d=document.createElement('div');d.className='count';const b=document.createElement('strong');b.textContent=n;d.append(b,document.createTextNode(label));$('#counts').append(d)}$('#scope').textContent='Generated '+s.generatedAt+' · Original inventory: '+s.inventoryRoutes+' routes, '+s.plannedCases+' remaining width cases. Additional navigation routes and fix retests are included when available.';
const rows=data.rows.filter(r=>(!$('#site').value||r.site===$('#site').value)&&(!$('#query').value||(r.path+' '+r.locale).toLowerCase().includes($('#query').value.toLowerCase()))&&(!$('#status').value||($('#status').value==='pending-review'?r.status!=='pixel-identical'&&!r.review:$('#status').value==='reviewed'?!!r.review:r.status===$('#status').value)));
$('#visible').textContent=rows.length+' comparisons shown';$('#rows').replaceChildren();for(const r of rows){const tr=document.createElement('tr');td(tr,r.site+' / '+r.locale);td(tr,r.path);td(tr,r.width);td(tr,r.review?r.review.status:r.status).className=r.status==='pixel-identical'?'exact':'warn';td(tr,r.changedPercent==null?'—':r.changedPercent.toFixed(4)+'%');td(tr,r.candidate);const c=td(tr,'');const b=document.createElement('button');b.textContent='Compare';b.onclick=()=>open(r);c.append(b);$('#rows').append(tr)}}
function open(r){selected=r;$('#viewer').hidden=false;$('#selected').textContent=r.site+' · '+r.path+' · '+r.width+' px';$('#notes').textContent=r.review?r.review.note:'Raw outcome: '+r.status+'. '+(r.status==='pixel-identical'?'Every screenshot pixel matches.':'Review the raw captures and metadata.');$('#details').textContent='Heights: '+(r.heights||[]).join(' / ')+' · HTTP: '+(r.httpStatus||[]).join(' / ')+' · Runtime errors (local/live): '+(r.errorCounts||[]).join(' / ')+' · Captured '+r.completedAt+' · Candidate '+r.candidate;$('#json').href=r.source+'/'+r.key+'.json';for(const side of ['live','local'])$('#'+side).src=r.source+'/'+r.key+'-'+side+'.png';$('#jump').value=Object.keys(r.differenceBands||{})[0]||0;$('#viewer').scrollIntoView({behavior:'smooth'})}
$('#go').onclick=()=>{for(const side of ['live','local']){const img=$('#'+side);img.parentElement.scrollTop=Number($('#jump').value)*img.clientWidth/selected.width}};$('#close').onclick=()=>$('#viewer').hidden=true;for(const id of ['site','status','query'])$('#'+id).oninput=render;
async function load(){data=await(await fetch('report-data.json?'+Date.now())).json();render()}$('#refresh').onclick=load;load();
</script></html>`)
console.log(JSON.stringify(summary))
