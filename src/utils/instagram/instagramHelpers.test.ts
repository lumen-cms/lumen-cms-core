import { getMediaByUsername } from 'nanogram.js'
import { fetchInstagramUserId, getInstagramApi } from './instagramHelpers'

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
})
