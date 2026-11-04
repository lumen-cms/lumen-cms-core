import { lookup } from 'node:dns/promises'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { BlockList, isIP } from 'node:net'

const blocked = new BlockList()
for (const [ip, prefix] of [['0.0.0.0',8], ['10.0.0.0',8], ['100.64.0.0',10], ['127.0.0.0',8], ['169.254.0.0',16], ['172.16.0.0',12], ['192.0.0.0',24], ['192.0.2.0',24], ['192.168.0.0',16], ['198.18.0.0',15], ['198.51.100.0',24], ['203.0.113.0',24], ['224.0.0.0',4], ['240.0.0.0',4]]) blocked.addSubnet(ip, prefix)
const globalV6 = new BlockList()
globalV6.addSubnet('2000::', 3, 'ipv6')
for (const [ip, prefix] of [['2001::',23], ['2001:db8::',32], ['2002::',16], ['3fff::',20]]) blocked.addSubnet(ip, prefix, 'ipv6')
export function isPublicAddress(address) {
  const family = isIP(address)
  return family === 4 ? !blocked.check(address, 'ipv4') : family === 6 && globalV6.check(address, 'ipv6') && !blocked.check(address, 'ipv6')
}
export function validateSource(value) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || (url.port && !['80','443'].includes(url.port))) throw new Error('Invalid source')
  return url
}
export async function fetchImage(value, signal, redirects = 0) {
  if (redirects > 4) throw new Error('Too many redirects')
  const url = validateSource(value)
  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  const addresses = isIP(hostname) ? [{ address: hostname, family: isIP(hostname) }] : await lookup(hostname, { all: true })
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) throw new Error('Source is not public')
  const selected = addresses[0]
  // Pin the validated address to the connection, preventing DNS rebinding.
  const response = await new Promise((resolve, reject) => {
    const req = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, {
      signal, agent: false,
      lookup: (_hostname, options, callback) => options.all ? callback(null, [selected]) : callback(null, selected.address, selected.family),
      headers: { Accept: 'image/*', 'User-Agent': 'LumenImageProxy/1' },
    }, resolve)
    req.on('error', reject)
    req.end()
  })
  if ([301,302,303,307,308].includes(response.statusCode)) {
    response.resume()
    if (!response.headers.location) throw new Error('Missing redirect')
    return fetchImage(new URL(response.headers.location, url), signal, redirects + 1)
  }
  if (response.statusCode !== 200) { response.destroy(); throw new Error('Source unavailable') }
  const chunks = []
  let size = 0
  for await (const chunk of response) {
    size += chunk.length
    if (size > 20 * 1024 * 1024) { response.destroy(); throw new Error('Source too large') }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}
