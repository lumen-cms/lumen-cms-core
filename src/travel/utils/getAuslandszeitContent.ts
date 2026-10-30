export async function getAuslandszeitContent(props: { query_filter?: string }) {
  const apiKey = process.env.AUSLANDSZEIT_API_KEY
  if (!apiKey)
    throw new Error('AUSLANDSZEIT_API_KEY is required for the jobs feed')
  const buildFeedUrl = `https://www.auslandsjob.de/wp-json/ajo-job-finder/v1/feed/studentsgoabroad${
    props?.query_filter ? `${props?.query_filter}` : ''
  }`
  const url = new URL(buildFeedUrl)
  const feedUrl = url.toString()
  const auslandszeitData = await fetch(feedUrl, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
  })
  if (!auslandszeitData.ok)
    throw new Error(`Jobs feed request failed: ${auslandszeitData.status}`)
  const data = await auslandszeitData.json()
  return data
}
