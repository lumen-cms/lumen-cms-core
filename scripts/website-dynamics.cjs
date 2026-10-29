// Reviewed exceptions, scoped to observed widgets. Never exclude CMS body carousels.
// This function is serialized into the browser: keep its helpers self-contained.
function collectReviewedRegions({ site }) {
  const regions = []
  const text = (value) => value.replace(/\s+/g, ' ').trim()
  const rect = (el) => {
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height }
  }
  const visible = (el) =>
    el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
    el.getBoundingClientRect().width > 0 &&
    el.getBoundingClientRect().height > 0
  const styling = (el) => {
    const s = getComputedStyle(el)
    return [
      s.fontFamily,
      s.fontSize,
      s.fontWeight,
      s.lineHeight,
      s.color,
      s.textAlign
    ].join('|')
  }
  if (site === 'upskill') {
    const banners = [
      ...document.querySelectorAll(
        'main > div > .lm-carousel, main > div > .slider-container'
      )
    ].filter((el) => {
      const r = rect(el)
      return (
        visible(el) &&
        r.x === 0 &&
        r.y < 200 &&
        r.width === innerWidth &&
        r.height < 180
      )
    })
    if (banners.length === 1) {
      const el = banners[0]
      const slides = [...el.querySelectorAll('.swiper-slide, .slide')]
      const deck = [...new Set(slides.map((s) => text(s.textContent)))].sort()
      const typography = [
        ...new Set(
          slides.flatMap((s) =>
            [...s.querySelectorAll('p,a,b,strong')].map(
              (e) => `${text(e.textContent)}|${styling(e)}`
            )
          )
        )
      ].sort()
      regions.push({
        id: 'upskill-announcement',
        kind: 'rotating-announcement',
        rect: rect(el),
        signature: JSON.stringify({ deck, typography }),
        reason:
          'Same announcement deck and typography; autoplay frame and fractional text rasterization vary.'
      })
    }
  }
  for (const el of document.querySelectorAll('img, video')) {
    if (!visible(el)) continue
    const url = new URL(
      el.currentSrc || el.src || el.querySelector('source')?.src || '',
      location.href
    )
    const source = url.searchParams.get('url') || url.href
    const video = el.tagName === 'VIDEO'
    if (video ? !el.autoplay : !/\.gif(?:[/?]|$)/i.test(source)) continue
    const s = getComputedStyle(el)
    regions.push({
      id: `${video ? 'video' : 'gif'}:${source.split('?')[0]}`,
      kind: video ? 'autoplay-video' : 'animated-image',
      rect: rect(el),
      signature: JSON.stringify([
        el.alt,
        video ? [el.controls, el.muted, el.loop] : null,
        s.objectFit,
        s.borderRadius,
        s.borderWidth
      ]),
      reason:
        'Animated media frame; source, bounds, controls, crop and border styling must match.'
    })
  }
  // Third-party appointment widgets: allow changing contents, never changed size.
  for (const el of document.querySelectorAll('iframe')) {
    if (!visible(el)) continue
    const url = new URL(el.src, location.href)
    if (url.hostname !== 'meetings.hubspot.com') continue
    regions.push({
      id: `meeting:${url.origin}${url.pathname}`,
      kind: 'external-appointment',
      rect: rect(el),
      signature: el.title,
      reason:
        'External appointment availability/time; iframe geometry must match.'
    })
  }
  for (const selector of [
    '.woot-widget-bubble',
    '.woot-widget-holder',
    '#hubspot-messages-iframe-container'
  ]) {
    for (const el of document.querySelectorAll(selector)) {
      const r = rect(el)
      if (
        !visible(el) ||
        getComputedStyle(el).position !== 'fixed' ||
        r.width > 450 ||
        r.height > 650
      )
        continue
      regions.push({
        id: selector,
        kind: 'external-chat',
        // Chatwoot's bubble paints a 24px blur with an 8px vertical offset
        // outside its DOM box. Include that known shadow, not arbitrary layout.
        rect:
          selector === '.woot-widget-bubble'
            ? {
                x: r.x - 24,
                y: r.y - 16,
                width: r.width + 48,
                height: r.height + 48
              }
            : r,
        optionalOverlay: true,
        reason:
          'Known fixed chat overlay arrives asynchronously; page layout remains checked.'
      })
    }
  }
  return regions
}

function matchReviewedRegions(local = [], live = []) {
  const regions = [],
    issues = []
  const ids = new Set([...local, ...live].map((r) => r.id))
  for (const id of ids) {
    const a = local.filter((r) => r.id === id),
      b = live.filter((r) => r.id === id)
    // Repeated instances require an explicit mapping, not an arbitrary pairing.
    if (a.length > 1 || b.length > 1) continue
    const left = a[0],
      right = b[0]
    if (left?.optionalOverlay || right?.optionalOverlay) {
      regions.push(...[left, right].filter(Boolean))
      continue
    }
    if (!left || !right) {
      issues.push(`Dynamic region missing on one side: ${id}`)
      continue
    }
    if (left.signature !== right.signature) {
      issues.push(`Dynamic region content or styling differs: ${id}`)
      continue
    }
    if (
      ['x', 'y', 'width', 'height'].some(
        (key) => Math.abs(left.rect[key] - right.rect[key]) > 1
      )
    ) {
      issues.push(`Dynamic region geometry differs: ${id}`)
      continue
    }
    // Intersection only: changed pixels outside the shared bounds still fail.
    const x = Math.max(left.rect.x, right.rect.x),
      y = Math.max(left.rect.y, right.rect.y)
    regions.push({
      ...left,
      rect: {
        x,
        y,
        width:
          Math.min(
            left.rect.x + left.rect.width,
            right.rect.x + right.rect.width
          ) - x,
        height:
          Math.min(
            left.rect.y + left.rect.height,
            right.rect.y + right.rect.height
          ) - y
      }
    })
  }
  return { regions, issues }
}
// Nuka's percentage transforms can place text 0.00024px off the integer grid.
// Chromium then rounds justified glyph spacing differently. Materializing the
// equivalent integer matrix removes that capture noise without moving layout
// by even 1/64 CSS pixel. Never normalize a real fractional slide position.
function stabilizeCarouselTransforms() {
  const normalized = []
  for (const el of document.querySelectorAll(
    '.slider-container .slider-list'
  )) {
    const transform = getComputedStyle(el).transform
    if (transform === 'none') continue
    const matrix = new DOMMatrixReadOnly(transform)
    if (
      !matrix.is2D ||
      matrix.a !== 1 ||
      matrix.b !== 0 ||
      matrix.c !== 0 ||
      matrix.d !== 1 ||
      Math.abs(matrix.e - Math.round(matrix.e)) > 0.001 ||
      Math.abs(matrix.f - Math.round(matrix.f)) > 0.001
    )
      continue
    const before = el.getBoundingClientRect()
    const original = el.style.transform
    const transition = el.style.transitionDuration
    el.style.transitionDuration = '0s'
    el.style.transform = `matrix(1, 0, 0, 1, ${Math.round(
      matrix.e
    )}, ${Math.round(matrix.f)})`
    const after = el.getBoundingClientRect()
    const dx = after.x - before.x,
      dy = after.y - before.y
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      el.style.transform = original
      el.style.transitionDuration = transition
      continue
    }
    if (dx || dy) normalized.push({ selector: el.className, dx, dy })
  }
  return normalized
}
module.exports = {
  collectReviewedRegions,
  matchReviewedRegions,
  stabilizeCarouselTransforms
}
