const { parseMetaEvent } = require("./facebook-audit/parse-event.cjs");
const http = require("http"), fs = require("fs/promises"), path = require("path");
const root = path.resolve(__dirname, "..");
const partytownRequire = require("node:module").createRequire(require.resolve("@astrojs/partytown", { paths: [path.join(root, "packages/lumen-cms-astro")] }));
const { partytownSnippet } = partytownRequire("@qwik.dev/partytown/integration");
const auditDirectory = path.join(require("node:os").tmpdir(), "lumen-facebook-partytown-audit");
require("node:fs").mkdirSync(auditDirectory, { recursive: true });
require("esbuild").buildSync({ entryPoints: [path.join(__dirname, "facebook-audit/fastspring-fixture.ts")], bundle: true, format: "iife", outfile: path.join(auditDirectory, "fastspring-fixture.js") });
const lib = path.join(path.dirname(partytownRequire.resolve("@qwik.dev/partytown/package.json")), "lib");
const hits = [], errors = [], diagnostics = [], visits = [];
const intercept = `(()=>{const map=value=>{try{const u=new URL(String(value),location.href);if(u.hostname==='facebook.com'||u.hostname.endsWith('.facebook.com'))return '/capture?original='+encodeURIComponent(u.href)}catch{}return value};const fetchOriginal=window.fetch;window.fetch=function(input,init){return fetchOriginal.call(this,typeof input==='string'||input instanceof URL?map(input):input,init)};const open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url,...args){return open.call(this,method,map(url),...args)};const beacon=navigator.sendBeacon.bind(navigator);navigator.sendBeacon=(url,data)=>beacon(map(url),data);const src=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{...src,set(value){src.set.call(this,map(value))}});const attr=Element.prototype.setAttribute;Element.prototype.setAttribute=function(name,value){return attr.call(this,name,this instanceof HTMLImageElement&&name.toLowerCase()==='src'?map(value):value)};window.addEventListener('error',e=>fetchOriginal('/error',{method:'POST',body:e.message}));document.addEventListener('securitypolicyviolation',e=>fetchOriginal('/error',{method:'POST',body:'CSP blocked '+e.blockedURI}));})();`;
const config = { forward: ["fbq"], resolveUrl: function(url, location, type) {
  if (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com")) {
    const p = new URL("/capture", location);
    p.searchParams.set("original", url.href);
    return p;
  }
  if (url.hostname === "connect.facebook.net") {
    const p = new URL("/proxy", location);
    p.searchParams.set("url", url.href);
    return p;
  }
  return url;
} };
const port = Number(process.env.FACEBOOK_AUDIT_PORT || 4397);
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://127.0.0.1:" + port);
    if (u.pathname === "/fastspring-fixture.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(await fs.readFile(path.join(auditDirectory, "fastspring-fixture.js")));
      return;
    }
    if (u.pathname === "/diagnostic") {
      let body = "";
      for await (const c of req) body += c;
      diagnostics.push(body);
      await fs.appendFile(path.join(auditDirectory, "diagnostics.jsonl"), body + "\n");
      res.writeHead(204).end();
      return;
    }
    if (u.pathname === "/capture") {
      let body = "";
      for await (const c of req) body += c;
      const original = u.searchParams.get("original") || "";
      const contentType = req.headers["content-type"] || "";
      const params = await parseMetaEvent(original || "https://facebook.com", body, contentType);
      const hit = { time: (/* @__PURE__ */ new Date()).toISOString(), original, params, body, contentType };
      hits.push(hit);
      await fs.appendFile(path.join(auditDirectory, "hits.jsonl"), JSON.stringify(hit) + "\n");
      res.writeHead(200, { "content-type": "image/gif", "access-control-allow-origin": "*" }).end(Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"));
      return;
    }
    if (u.pathname === "/error") {
      let body = "";
      for await (const c of req) body += c;
      errors.push(body);
      res.writeHead(204).end();
      return;
    }
    if (u.pathname === "/status") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ hits: hits.map((h) => ({ event: h.params.ev, pixel: h.params.id, value: h.params["cd[value]"], currency: h.params["cd[currency]"], eventID: h.params.eid, document: h.params.dl, contentIds: h.params["cd[content_ids]"], contentType: h.params["cd[content_type]"], matchingEmail: !!h.params["udff[em]"], transport: h.contentType || "query" })), errors, diagnostics, visits }));
      return;
    }
    if (u.pathname === "/proxy") {
      const target = new URL(u.searchParams.get("url"));
      if (target.protocol !== "https:" || target.hostname !== "connect.facebook.net" || target.port || target.username || target.password) throw Error("Forbidden");
      const r = await fetch(target, { redirect: "error" });
      res.setHeader("content-type", "text/javascript");
      res.end(await r.text());
      return;
    }
    if (u.pathname.startsWith("/~partytown/")) {
      const f = path.resolve(lib, u.pathname.slice(12));
      if (!f.startsWith(lib + "/")) throw Error("Forbidden");
      res.setHeader("content-type", f.endsWith(".js") ? "text/javascript" : "text/html");
      res.end(await fs.readFile(f));
      return;
    }
    if (u.pathname !== "/") {
      res.writeHead(404).end();
      return;
    }
    visits.push({ time: (/* @__PURE__ */ new Date()).toISOString(), url: u.href });
    const worker = u.searchParams.get("mode") === "worker";
    const pixel = ({ planet: "1292661477415082", bali: "2863534213877650", studentsde: "538277029942771", studentsen: "1205753661121409" })[u.searchParams.get("pixel")] || "726824377950061";
    const init = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`;
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net; connect-src 'self' https://connect.facebook.net; img-src 'self' data:; style-src 'self' 'unsafe-inline'; worker-src 'self' blob:; frame-src 'self'; form-action 'none'; object-src 'none'");
    res.setHeader("content-type", "text/html");
    res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Facebook tracking comparison</title><script>${intercept}<\/script>${worker ? "<script>" + partytownSnippet(config) + "<\/script>" : ""}<script ${worker ? 'type="text/partytown"' : ""}>${init}<\/script><script ${worker ? 'type="text/partytown"' : ""} src="https://connect.facebook.net/en_US/fbevents.js"><\/script><style>body{font:18px system-ui;max-width:850px;margin:40px auto}button,a,input{font:inherit;margin:8px;padding:10px}pre{white-space:pre-wrap;font:13px monospace}</style></head><body><h1>Facebook: ${worker ? "Partytown" : "main thread"} / ${pixel}</h1><p>Local test. Facebook collection is redirected to this server. CSP blocks unhandled external collection. No test events are sent to Meta.</p><nav><a href="/?mode=main">Main thread</a><a href="/?mode=worker">Partytown</a><a href="/?mode=main&pixel=planet">Planet main</a><a href="/?mode=worker&pixel=planet">Planet worker</a></nav><button id="fastspring-start">Test FastSpring checkout start</button><button id="fastspring-complete">Test FastSpring completed purchase</button><button id="explicit">Test explicit conversions</button><form id="application"><label>Email <input type="email" name="email" value="audit@example.invalid"></label><button type="submit">Apply now</button></form><a href="/?mode=${worker ? "worker" : "main"}&navigation=1">Test navigation</a><h2>Captured requests (all visits)</h2><pre id="status">Waiting\u2026</pre><script>document.addEventListener('click',e=>fetch('/diagnostic',{method:'POST',body:JSON.stringify({scope:'click',target:e.target.id||e.target.textContent,forwardQueue:window._ptf?.length,source:String(window.fbq)})}));document.getElementById('explicit').onclick=()=>{fbq('track','Lead',{content_name:'normal-browser-audit'},{eventID:'audit-lead'});fbq('track','Purchase',{value:12.34,currency:'EUR',content_ids:['audit-course']},{eventID:'audit-purchase'});fbq('trackCustom','AuditCustom',{test_parameter:'retained'},{eventID:'audit-custom'})};document.querySelector('form').onsubmit=e=>e.preventDefault();setInterval(async()=>{document.getElementById('status').textContent=JSON.stringify(await(await fetch('/status')).json(),null,2)},1000)<\/script><script src="/fastspring-fixture.js"><\/script><script ${worker ? 'type="text/partytown"' : ""}>setTimeout(()=>{fetch('/diagnostic',{method:'POST',body:JSON.stringify({scope:'sdk',page:location.href,type:typeof fbq,state:typeof fbq==='function'&&fbq.getState?fbq.getState():null})})},5000)<\/script><script>setTimeout(()=>fetch('/diagnostic',{method:'POST',body:JSON.stringify({scope:'main',page:location.href,type:typeof window.fbq,forwardQueue:window._ptf?.length,fbqSource:String(window.fbq),scripts:[...document.scripts].map(s=>({src:s.src,type:s.type}))})}),7000)<\/script></body></html>`);
  } catch (e) {
    errors.push(String(e));
    res.writeHead(500).end(String(e));
  }
});
server.listen(port, "127.0.0.1", () => console.log("Normal-browser fixture: http://127.0.0.1:" + port + "/"));
