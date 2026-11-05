const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseMetaEvent } = require("./parse-event.cjs");
test("reads image/query events", async () => {
  assert.deepEqual(await parseMetaEvent("https://www.facebook.com/tr/?id=123&ev=PageView", ""), { id: "123", ev: "PageView" });
});
test("reads multipart beacon events, including automatic matching and conversion data", async () => {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ev: "Purchase", id: "123", "cd[value]": "12.34", "cd[currency]": "EUR", "cd[content_ids]": '["course"]', eid: "order-id", "udff[em]": "synthetic-hash" })) form.set(k, v);
  const r = new Response(form);
  const parsed = await parseMetaEvent("https://www.facebook.com/tr/?ev=stale", await r.text(), r.headers.get("content-type"));
  assert.deepEqual(parsed, { ev: "Purchase", id: "123", "cd[value]": "12.34", "cd[currency]": "EUR", "cd[content_ids]": '["course"]', eid: "order-id", "udff[em]": "synthetic-hash" });
});
test("reads urlencoded POSTs with body overriding URL values", async () => {
  assert.deepEqual(await parseMetaEvent("https://www.facebook.com/tr/?ev=stale", "ev=SubscribedButtonClick&cd%5BbuttonText%5D=Apply+now", "application/x-www-form-urlencoded;charset=UTF-8"), { ev: "SubscribedButtonClick", "cd[buttonText]": "Apply now" });
});
test("fails explicitly on unrecognized nonempty payloads", async () => {
  await assert.rejects(parseMetaEvent("https://www.facebook.com/tr/", "unparsed", "text/plain"), /Unsupported/);
});
