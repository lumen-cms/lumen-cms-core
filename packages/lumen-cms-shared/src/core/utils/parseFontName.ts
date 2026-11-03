export default function parseFont(string?: string) {
  if (!string) return null
  const name = string.split(':')[0]
  return name.replace(/\+/g, ' ')
}
