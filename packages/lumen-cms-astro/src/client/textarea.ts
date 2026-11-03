import { onUnmount } from './lifecycle'

export function initializeTextareas() {
 document.querySelectorAll<HTMLTextAreaElement>('textarea[data-lm-autosize]').forEach(field => {
  if (field.dataset.initialized) return
  field.dataset.initialized = 'true'
  const listeners = new AbortController()
  const update = () => {
   if (!field.clientWidth) return
   const style = getComputedStyle(field)
   const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
   const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
   const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
   const minimum = field.rows * line + padding
   const maximum = Number(field.dataset.maxRows) > 0 ? Math.max(field.rows, Number(field.dataset.maxRows)) * line + padding : Infinity
   field.style.height = '0px'
   const height = Math.max(minimum, Math.min(field.scrollHeight, maximum))
   field.style.overflowY = field.scrollHeight > maximum ? 'auto' : 'hidden'
   field.style.height = `${style.boxSizing === 'border-box' ? height + border : height - padding}px`
  }
  field.addEventListener('input', update, { signal: listeners.signal })
  field.form?.addEventListener('reset', () => queueMicrotask(() => { if (!listeners.signal.aborted) update() }), { signal: listeners.signal })
  let lastWidth = -1
  const observer = new ResizeObserver(entries => {
   const width = entries[0]?.contentRect.width
   if (width !== lastWidth) { lastWidth = width; update() }
  })
  observer.observe(field)
  onUnmount(field, () => { listeners.abort(); observer.disconnect() })
  update()
 })
}
