import axios from 'axios'

const baseURL = 'https://api.elasticemail.com/v2'
const elastic = axios.create({
  baseURL
})

const _getUidString = (array: any[]) =>
  array.length && `;${array.map((e) => e.id || e).join(';')};`

export function prepareElasticContact(model: Record<string, any>) {
  const obj: any = {}
  Object.keys(model).forEach((key) => {
    if (!model[key] || model[key] === '') return
    if (key === 'email') {
      obj.email = model.email
    } else if (key === 'given_name') {
      obj.firstName = model[key]
    } else if (key === 'family_name') {
      obj.lastName = model[key]
    } else if (key === 'orders') {
      obj.field_orders =
        (Array.isArray(model[key]) &&
          _getUidString(
            model[key].map(
              (i: any) =>
                i[process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY as string] || i
            )
          )) ||
        ''
    } else if (model[key].constructor === Array && model[key].length) {
      obj[`field_${key}`] = _getUidString(model[key])
    } else {
      obj[`field_${key}`] = model[key]
    }
  })
  return obj
}

export async function getFindApi(email: string) {
  try {
    const res = await elastic.get('/contact/loadcontact', {
      params: {
        apikey: process.env.ELASTIC_EMAIL_API_KEY,
        email
      }
    })
    return res.data
  } catch (e) {
    console.log('elastic contact update not successful')
  }
  return false
}

export async function getAddApi(data: Record<string, any>) {
  const params = {
    apikey: process.env.ELASTIC_EMAIL_API_KEY,
    ...data
  }
  try {
    const res = await elastic.get('/contact/quickadd', {
      params
    })
    return res.data
  } catch (e) {
    console.log('elastic contact update not successful')
  }
  return false
}

export async function getUpdateApi(data: Record<string, any>) {
  const params = {
    apikey: process.env.ELASTIC_EMAIL_API_KEY,
    clearRestOfFields: false,
    activate: true,
    ...data
  }
  try {
    const res = await elastic.get('/contact/update', {
      params
    })
    return res.data
  } catch (e) {
    console.log('elastic contact update not successful')
  }
  return false
}
