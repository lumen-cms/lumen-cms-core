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
  const existingElasticUser = findContact.data

  if (!existingElasticUser) {
    return getAddApi(prepared)
  }

  const resultUpdate = await getUpdateApi(prepared)
  const updateData = resultUpdate.data
  if (!resultUpdate.success) {
    console.log(data)
    throw new Error('Update of elastic contact not successful')
  }
  return updateData
}
