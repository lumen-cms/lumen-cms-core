async function parseMetaEvent(originalUrl, body, contentType = "") {
  const params = new URLSearchParams(new URL(originalUrl).search);
  if (body) {
    if (contentType.startsWith("multipart/form-data")) {
      const form = await new Response(body, { headers: { "content-type": contentType } }).formData();
      for (const [key, value] of form) if (typeof value === "string") params.set(key, value);
    } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
      for (const [key, value] of new URLSearchParams(body)) params.set(key, value);
    } else throw new Error("Unsupported nonempty Meta event content type: " + contentType);
  }
  return Object.fromEntries(params);
}
module.exports = { parseMetaEvent };
