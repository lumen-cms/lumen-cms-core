import { CategoryStateProp } from '../page/pageContextTypes'
import { AllTravelsQuery } from '../../typings/generated/hasura-schema'

export const travelFilterOnCategories = (
  travels: AllTravelsQuery['travel'],
  { branch, travelType, city, country, searchtext }: CategoryStateProp
) => {
  return travels.filter((travel) => {
    const isTrueArray = []
    if (branch) {
      isTrueArray.push(
        travel.mn_travel_branches?.some(
          (branchMn) => branchMn.branch_id === Number(branch)
        )
      )
    }
    if (travelType) {
      isTrueArray.push(
        travel.mn_travel_travel_types?.some(
          (tr) => tr.travel_type_id === Number(travelType)
        )
      )
    }
    if (city) {
      isTrueArray.push(travel.city_id === Number(city))
    }
    if (country) {
      isTrueArray.push(travel.city?.country_id === Number(country))
    }
    if (searchtext) {
      const textArr = searchtext.split(' ')
      for (let i = 0; i < textArr.length; i++) {
        const searchText = textArr[i]
        isTrueArray.push(
          travel.title?.search(new RegExp(searchText, 'i')) !== -1
        )
      }
    }

    return isTrueArray.every((i) => i)
  })
}
