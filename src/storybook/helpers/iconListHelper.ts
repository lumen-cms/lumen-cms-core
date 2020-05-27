import iconList from '@lumen/storyblok-material-icons/src/material-icon-list.json'

// enable next lines if we need an array of items
// let materialIcons: string[] = []
//
// const prepAllIcons = () => {
//   iconList.categories.forEach((category: any) => {
//     materialIcons = materialIcons.concat(category.icons.map((i: { id: string, name: string }) => i.id.slice(3)))
//   })
// }
//
// prepAllIcons()
// export const materialIconList = materialIcons

const iconListToOptions = () => {
  const obj = {}
  let preparedList: { id: string, name: string }[] = []
  iconList.categories.forEach((category: any) => {
    preparedList = preparedList.concat(category.icons)
  })
  preparedList.forEach((item) => {
    obj[item.name] = item.id.slice(3)
  })
  return obj
}

const opts = iconListToOptions()

export default opts


