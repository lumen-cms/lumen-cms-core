import { getMediaByUsername } from 'nanogram.js'
import {
  fetchInstagramUserId,
  getInstagramApi,
  scrapeInstagramUser
} from './instagramHelpers'

const user = {
  upskill: {
    name: 'upskillbali',
    id: '4405126451'
  },
  biophilia: {
    name: 'biophilia_matters',
    id: '13512139620',
    appId: 260476102414625,
    token:
      'IGQVJWNE1weWJQZA05yb0VoUVdqUXl2ZA3hkZA3RUdzBfcXZAFd3JMT0tCWGhITnc5bGxRYVZAaV3c0a0JiYloyNjg3UlpLdUxWZAjN0NDk5Ym04Q2djUXVoLXFiR05rRnIzUW1Yc0JUYVRBNWZAlckF6amlONQZDZD'
  }
}

describe('Test Instagram', () => {
  test('Get userID from username upskill', async () => {
    const userId = await fetchInstagramUserId(user.upskill.name)
    expect(userId).toBe(user.upskill.id)
  })
  test('Get userID from username biophilia', async () => {
    const userId = await fetchInstagramUserId(user.biophilia.name)
    expect(userId).toBe(user.biophilia.id)
  })

  test('test token', async () => {
    const url = new URL(
      `https://graph.facebook.com/v10.0/me/accounts?access_token=${user.biophilia.token}`
    ).toString()
    const res = await fetch(url).then((r) => r.json())
    console.log(res)
    expect(res.error).toBeUndefined()
  })

  test('test old school', async () => {
    const url = `https://www.instagram.com/upskillbali/?__a=1`
    const response = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
      }
    }).then((r) => r.json())
    console.log(response)
  })

  test('another try', async () => {
    const res = await fetch(
      `https://graph.facebook.com/v10.0/${user.biophilia.id}?fields=id,media_type,media_url,owner,timestamp&access_token=${user.biophilia.token}`
    ).then((r) => r.json())
    console.log(res)
  })
  test('Fetch instagram posts based on user', async () => {
    const { media } = getInstagramApi({
      userId: user.biophilia.id,
      token: user.biophilia.token
    })
    const res = await fetch(media).then((r) => r.json())
    console.log(media, res)
    expect(res.error).toBeUndefined()
    expect(!!res).toBeTruthy()
  })
  test('Get media by username', async () => {
    const res = await getMediaByUsername(user.upskill.name)
    console.log(res)
  })

  test('scrape instagram user', async () => {
    const res = await scrapeInstagramUser(user.upskill.name)
    console.log(res)
    expect(res.total).toBe(12)
  })
})
