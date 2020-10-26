import {
  getAddApi,
  getUpdateApi,
  prepareElasticContact
} from './elastic-helpers'

export const updateElasticContact = async ({
  data
}: {
  data: Record<string, any>
}) => {
  const prepared = prepareElasticContact(data)

  const resultAdd = await getAddApi(prepared)

  if (!resultAdd.data.success) {
    console.log(data)
    console.log('create of contact not successful')
  }
  const resultUpdate = await getUpdateApi(prepared)
  const d = resultUpdate.data
  if (!d.success) {
    console.log(data)
    throw new Error('Update of elastic contact not successful')
  }
  const r = d.data
  const c = r.customfields

  return {
    success: true,
    title: c.title,
    firstName: r.firstname,
    lastName: r.lastname,
    email: r.email,
    languageKey: c.languagekey,
    phone: c.phone,
    domain: c.domain
  }
}
