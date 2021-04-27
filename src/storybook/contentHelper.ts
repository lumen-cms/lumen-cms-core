export const storyImageUrls = [
  'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png',
  'https://a.storyblok.com/f/69529/3000x1688/50d31aa864/img_0766.jpg',
  'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg',
  'https://a.storyblok.com/f/69529/6000x4000/3c29c3c039/img_5956.jpg'
]

const getImageUrl = (i: number): number => {
  if (Number.isInteger(i / 5)) {
    return 3
  } else if (Number.isInteger(i / 4)) {
    return 2
  } else if (Number.isInteger(i / 3)) {
    return 1
  }
  return 0
}

export const getStorybookImageOnIteration = (i: number) => {
  const item = i < 4 ? i : getImageUrl(i)

  return storyImageUrls[item]
}
