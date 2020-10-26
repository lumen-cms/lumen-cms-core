import axios from 'axios'

export const elastic = axios.create({
  baseURL: 'https://api.elasticemail.com/v2'
})

export function getElasticAccount(key: string) {
  const accounts = {
    // @TODO
  }
  return accounts[key]
}

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
    } else {
      obj[`field_${key}`] = model[key]
    }
  })
  obj.field_contactCreatedAt = _getDateString()
  obj.field_contactUpdatedAt = _getDateString()
  return obj
}

export function getAddApi(data: Record<string, any>) {
  const params = {
    publicAccountID: getElasticAccount(data.field_domain || data.domain)
      .publicAccountID,
    sendActivation: false
  }
  Object.assign(params, data)

  return elastic.get('/contact/add', { params })
}

export function getUpdateApi(data: Record<string, any>) {
  const params = {
    apikey: getElasticAccount(data.field_domain || data.domain).apikey,
    clearRestOfFields: false,
    activate: true
  }
  delete data.field_firstpurchase
  delete data.field_contactCreatedAt
  Object.assign(params, data)
  return elastic.get('/contact/update', { params })
}

export function elasticChangeContactStatus(data: Record<string, any>) {
  const params = {
    apikey: getElasticAccount(data.domain).apikey,
    status: data.disabled ? -2 : 0,
    emails: data.email
  }
  return elastic.get('/contact/changestatus', { params })
}
