import sanitizeHtml from 'sanitize-html'
const cache = new Map<string, Promise<string>>()
export async function inlineSvg(source: string): Promise<string> {
  let pending = cache.get(source)
  if (!pending) {
    pending = (async () => {
      const response = await fetch(source, { signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error(`SVG asset failed (${response.status}): ${new URL(source).pathname}`)
      return sanitizeHtml(await response.text(), {
        parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
        allowedTags: ['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask', 'title', 'desc', 'use', 'symbol', 'text', 'tspan'],
        allowedAttributes: { '*': ['id', 'class', 'viewBox', 'xmlns', 'width', 'height', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'fill', 'fill-rule', 'fill-opacity', 'clip-rule', 'clip-path', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity', 'opacity', 'transform', 'gradientUnits', 'gradientTransform', 'offset', 'stop-color', 'stop-opacity', 'mask', 'preserveAspectRatio', 'font-family', 'font-size', 'font-weight', 'text-anchor'] }
      })
    })()
    cache.set(source, pending)
    pending.catch(() => cache.delete(source))
  }
  return pending
}
