// import axios from 'axios'

const baseURL = 'https://api.elasticemail.com/v2'
// export const elastic = axios.create({
//   baseURL
// })

/**
 * @description convert array to string for interests of client
 * @param array
 * @returns {string}
 */
const _getUidString = (array: any[]) =>
  array.length && `;${array.map((e) => e.id || e).join(';')};`

/**
 * @description substring any date to iso date format
 * @param d
 * @returns {string}
 */
const _getDateString = (d?: string) => {
  const date = d ? new Date(d) : new Date()
  return date.toISOString().substr(0, 10)
}

/**
 *
 * @param model
 * @returns {{}}
 */
export function prepareElasticContact(model: Record<string, any>) {
  const obj: any = {}
  Object.keys(model).forEach((key) => {
    if (!model[key] || model[key] === '') return
    if (model[key].constructor === Array && model[key].length) {
      obj[`field_${key}`] = _getUidString(model[key])
    } else if (key === 'email') {
      obj.email = model.email
    } else if (key === 'given_name') {
      obj.firstName = model[key]
    } else if (key === 'family_name') {
      obj.lastName = model[key]
    } else {
      obj[`field_${key}`] = model[key]
    }
  })
  obj.field_contactCreatedAt = _getDateString()
  obj.field_contactUpdatedAt = _getDateString()
  return obj
}

export function getFindApi(email: string) {
  const paramUrl = new URLSearchParams()
  paramUrl.append('apikey', process.env.ELASTIC_EMAIL_API_KEY as string)
  paramUrl.append('email', email)
  const fetchURL = `${baseURL}/contact/loadcontact?${paramUrl.toString()}`
  console.log(fetchURL)
  return fetch(fetchURL).then((r) => r.json())
}

export function getAddApi(data: Record<string, any>) {
  const params = {
    apikey: process.env.ELASTIC_EMAIL_API_KEY
  }
  Object.assign(params, data)
  const paramUrl = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    paramUrl.append(key, params[key])
  })
  const fetchURL = `${baseURL}/contact/quickadd?${paramUrl.toString()}`
  console.log(fetchURL)
  return fetch(fetchURL).then((r) => r.json())
}

export function getUpdateApi(data: Record<string, any>) {
  const params = {
    apikey: process.env.ELASTIC_EMAIL_API_KEY,
    clearRestOfFields: false,
    activate: true
  }
  delete data.field_firstpurchase
  delete data.field_contactCreatedAt
  Object.assign(params, data)
  const paramUrl = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    paramUrl.append(key, params[key])
  })

  const fetchURL = `${baseURL}/contact/update?${paramUrl.toString()}`
  console.log(fetchURL)
  return fetch(fetchURL).then((r) => r.json())
}
