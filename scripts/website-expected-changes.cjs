// User-approved renderer migration, 2026-10-29. Keep live pixels as evidence.
// Serialized into the browser; do not reference module-scope helpers here.
function collectSearchRegions() {
  const regions = []
  const clean = (value) =>
    (value || '')
      .replace(/[\u200b\ufeff]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  const visible = (el) =>
    el &&
    el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
    el.getBoundingClientRect().width > 0 &&
    el.getBoundingClientRect().height > 0
  const configs = new Set()
  const walk = (value) => {
    if (!value || typeof value !== 'object') return
    if (value.component === 'list_search_autocomplete')
      configs.add(
        JSON.stringify([clean(value.label), clean(value.placeholder)])
      )
    for (const child of Object.values(value)) walk(child)
  }
  try {
    walk(
      JSON.parse(document.getElementById('__NEXT_DATA__')?.textContent || '{}')
    )
  } catch {
    /* No proven legacy component: no exception. */
  }
  const add = (el, version, label, placeholder, mode) => {
    if (!visible(el)) return
    const r = el.getBoundingClientRect()
    const signature = JSON.stringify([clean(label), clean(placeholder), mode])
    regions.push({
      id: `list_search_autocomplete:${signature}`,
      kind: 'expected-component-change',
      version,
      signature,
      rect: { x: r.x, y: r.y + scrollY, width: r.width, height: r.height },
      reason:
        'Approved 2026-10-29: list_search_autocomplete now opens the shared Cmd+K search dialog.'
    })
  }
  for (const el of document.querySelectorAll(
    'button[data-lm-search-version="command-palette-v1"][aria-haspopup="dialog"]'
  )) {
    add(
      el,
      'command-palette-v1',
      el.dataset.lmSearchLabel,
      el.dataset.lmSearchPlaceholder,
      el.dataset.lmSearchMode
    )
  }
  for (const el of document.querySelectorAll('.MuiAutocomplete-root')) {
    const input = el.querySelector(
      'input[role="combobox"][aria-autocomplete="both"]'
    )
    if (
      !input ||
      !el.querySelector('.MuiInputAdornment-positionStart .MuiSvgIcon-root') ||
      el.querySelector('.MuiAutocomplete-popupIndicator')
    )
      continue
    const label = clean(el.querySelector('label')?.textContent)
    const placeholder = clean(input.placeholder)
    if (!configs.has(JSON.stringify([label, placeholder]))) continue
    if (visible(el)) add(el, 'inline-autocomplete', label, placeholder, 'input')
    else {
      // Legacy mobile container: icon followed immediately by its hidden input overlay.
      const overlay = el.parentElement
      const icon = overlay?.previousElementSibling
      if (
        overlay?.classList.contains('MuiBox-root') &&
        icon?.matches('button.MuiIconButton-root')
      )
        add(icon, 'inline-autocomplete', label, placeholder, 'icon')
    }
  }
  return regions
}

function matchSearchRegions(local = [], live = []) {
  const regions = [],
    issues = []
  for (const id of new Set([...local, ...live].map((r) => r.id))) {
    const a = local.filter((r) => r.id === id),
      b = live.filter((r) => r.id === id)
    if (![...a, ...b].some((r) => r.version === 'command-palette-v1')) continue
    if (
      a.length === b.length &&
      [...a, ...b].every((r) => r.version === 'command-palette-v1')
    )
      continue
    // Ambiguous repeated labels are deliberately not masked.
    if (a.length > 1 || b.length > 1) {
      issues.push(`Ambiguous search component mapping: ${id}`)
      continue
    }
    const left = a[0],
      right = b[0]
    if (!left || !right) {
      issues.push(`Search component missing or labels changed: ${id}`)
      continue
    }
    // Once live also uses the new renderer, normal strict pixel comparison resumes.
    if (left.version === right.version) continue
    if (
      left.version !== 'command-palette-v1' ||
      right.version !== 'inline-autocomplete'
    ) {
      issues.push(`Unapproved search renderer transition: ${id}`)
      continue
    }
    const l = left.rect,
      r = right.rect
    const widthDelta = l.width - r.width
    const validWidth =
      Math.abs(widthDelta) <= 1 ||
      (left.signature.endsWith(',"input"]') &&
        Math.abs(r.width - 180) <= 1 &&
        Math.abs(l.width - 220) <= 1)
    const aligned =
      Math.abs(l.x - r.x) <= 1 || Math.abs(l.x + l.width - r.x - r.width) <= 1
    if (
      !validWidth ||
      !aligned ||
      Math.abs(l.y - r.y) > 1 ||
      Math.abs(l.height - r.height) > 1 ||
      Math.min(l.width, l.height, r.width, r.height) <= 0
    ) {
      issues.push(
        `Search component geometry differs beyond approved opener change: ${id}`
      )
      continue
    }
    // Only the two actual control boxes, never a toolbar, surrounding layout or dialog.
    regions.push(left, right)
  }
  return { regions, issues }
}
module.exports = { collectSearchRegions, matchSearchRegions }
