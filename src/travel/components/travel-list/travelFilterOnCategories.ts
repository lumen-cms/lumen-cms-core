import { CategoryStateProp } from '../page/pageContextTypes'
import { AllTravelsQuery } from '../../typings/generated/hasura-schema'

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const travelFilterOnCategories = (
  travels: AllTravelsQuery['travel'],
  { branch, travelType, city, country, searchtext }: CategoryStateProp
) => {
  return travels.filter((travel) => {
    const isTrueArray = []
    if (branch) {
      isTrueArray.push(
        travel.mn_travel_branches?.some((branchMn) =>
          String(branch).split(',').includes(String(branchMn.branch_id))
        )
      )
    }
    if (travelType) {
      isTrueArray.push(
        travel.mn_travel_travel_types?.some((tr) =>
          String(travelType).split(',').includes(String(tr.travel_type_id))
        )
      )
    }
    if (city) {
      isTrueArray.push(String(city).split(',').includes(String(travel.city_id)))
    }
    if (country) {
      isTrueArray.push(
        String(country).split(',').includes(String(travel.city?.country_id))
      )
    }
    if (searchtext) {
      const textArr = searchtext.split(' ')
      for (let i = 0; i < textArr.length; i++) {
        const searchText = textArr[i]
        isTrueArray.push(
          travel.title?.search(new RegExp(escapeRegExp(searchText), 'i')) !== -1
        )
      }
    }

    return isTrueArray.every((i) => i)
  })
}
