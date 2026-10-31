import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import LmSquareImage from './LmSquareImage'

it.each([true, false, undefined])(
  'preserves image markup and preload hints for priority %s',
  (priority) => {
    const image = 'https://a.storyblok.com/f/1/800x400/abcdef/image.jpg'
    const legacy = { priority }
    const render = (imageProps: { priority?: boolean; preload?: boolean }) =>
      renderToStaticMarkup(
        <LmSquareImage image={image} size={120} imageProps={imageProps} />
      )

    expect(render({ preload: priority })).toBe(render(legacy))
    expect(render({ preload: priority }).includes('rel="preload"')).toBe(
      priority === true
    )
  }
)
