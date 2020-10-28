import {
  getAddApi,
  getFindApi,
  getUpdateApi,
  prepareElasticContact
} from './elastic-helpers'

export type UpdateElasticProps = {
  data: {
    email: string
    given_name?: string
    family_name?: string
    phone?: string
    orders?: any[]
    lang?: string | 'en' | 'de'
  }
}

export const updateElasticContact = async ({ data }: UpdateElasticProps) => {
  const prepared = prepareElasticContact(data)

  const findContact = await getFindApi(prepared.email)
  const existingElasticUser = findContact?.data

  if (!existingElasticUser) {
    prepared.emails = prepared.email
    delete prepared.email // field email does not exist in add call
    return getAddApi(prepared)
  }

  const oldOrders = existingElasticUser.customfields?.orders ?? ''
  if (oldOrders && prepared.field_orders) {
    // merge old and new orders together
    const oldOrdersArray = oldOrders.split(';').filter((i: string) => i)
    const newOrders =
      prepared.field_orders?.split(';').filter((i: string) => i) ?? []
    prepared.field_orders = `;${[
      ...new Set([...oldOrdersArray, ...newOrders])
    ].join(';')};`
  }
  const updateData = await getUpdateApi(prepared)

  return updateData?.data
}
