export function expandedLayerStyle({ expanded = true, translateY, speed }: { expanded?: boolean; translateY?: (string | number)[]; speed?: number }) {
 if (!expanded) return {}
 if (translateY) {
  const unit = (value: string | number) => typeof value === 'number' || /^-?[\d.]+$/.test(value) ? '%' : value.endsWith('px') ? 'px' : value.endsWith('%') ? '%' : undefined
  const [start, end] = translateY
  if (unit(start) && unit(start) === unit(end)) return { top: `${-Math.abs(parseFloat(String(end)))}${unit(end)}`, bottom: `${-Math.abs(parseFloat(String(start)))}${unit(start)}` }
 }
 return speed ? { top: `${-Math.abs(speed) * 10}px`, bottom: `${-Math.abs(speed) * 10}px` } : {}
}
