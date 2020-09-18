import { v4 as uuidv4 } from 'uuid'

export const getUid = () => uuidv4()
export const storyImageUrls = [
  'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png',
  'https://a.storyblok.com/f/69529/3000x1688/50d31aa864/img_0766.jpg',
  'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg',
  'https://a.storyblok.com/f/69529/6000x4000/3c29c3c039/img_5956.jpg'
]
export const storyImageOptions = () => {
  const obj = {
    'Select or drop a public url': undefined
  }
  storyImageUrls.forEach((url, i) => {
    obj[`${url}_${i}`] = url
  })
  return obj
}
export const allImageOptions = storyImageOptions()

const storyVideoUrls = [
  'https://a.storyblok.com/f/82895/x/a266d33556/union-klischee-leiterbahn.mp4'
]
const storyAssetVideoOptions = () => {
  const obj = {
    'Select an asset': undefined
  }
  storyVideoUrls.forEach((url, i) => {
    obj[`${url}_${i}`] = url
  })
  return obj
}

export const allAssetVideoOptions = storyAssetVideoOptions()
