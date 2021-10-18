import { googleFormGetData } from './googleFormData'

describe('Google Form Data', function () {
  test('test if google forms work', async () => {
    const data = googleFormGetData({
      api: 'https://docs.google.com/forms/d/e/1FAIpQLSdw3tdslj4k94OU6bluk0Yobe997r8gV5obEbEdiMs70SKQPw/viewform?embedded=true',
      submit_button: [],
      _uid: '123',
      component: 'form'
    })
    expect(!!data).toBeTruthy()
    // console.log(data)
  })
})
