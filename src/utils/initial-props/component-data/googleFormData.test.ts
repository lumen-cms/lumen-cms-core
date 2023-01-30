import { googleFormGetData } from './googleFormData'

describe('Google Form Data', function () {
  test('test if google forms work', async () => {
    const data = await googleFormGetData({
      api: 'https://docs.google.com/forms/d/e/1FAIpQLSdw3tdslj4k94OU6bluk0Yobe997r8gV5obEbEdiMs70SKQPw/viewform?embedded=true',
      submit_button: [],
      _uid: '123',
      component: 'form'
    })
    expect(!!data?.fields?.length).toBeTruthy()
    // console.log(data)
  })
  test('test malfunction form', async () => {
    const data = await googleFormGetData({
      api: 'https://docs.google.com/forms/d/e/1FAIpQLScnOCZ9F_mnnJIX7pzhJmO8X0XdhPakpthsRq4PdIjwDixJ9g/viewform?usp=sf_link',
      submit_button: [],
      _uid: '123',
      component: 'form'
    })
    console.log(data)
    expect(!!data?.fields?.length).toBeTruthy()
  })
})
