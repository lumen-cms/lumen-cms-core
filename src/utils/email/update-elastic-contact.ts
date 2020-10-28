import {
  getAddApi,
  getFindApi,
  getUpdateApi,
  prepareElasticContact
} from './elastic-helpers'

export const updateElasticContact = async ({
  data
}: {
  data: Record<string, any>
}) => {
  const prepared = prepareElasticContact(data)

  const findContact = await getFindApi(prepared.email)
  const existingElasticUser = findContact?.data

  if (!existingElasticUser) {
    prepared.emails = prepared.email
    delete prepared.email // field email does not exist in add call
    return getAddApi(prepared)
  }

  const oldOrders = existingElasticUser.customfields?.orders ?? ''
  if (oldOrders) {
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
