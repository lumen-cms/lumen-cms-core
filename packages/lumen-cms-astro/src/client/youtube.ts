export function initializeYoutubeEmbeds() {
 document.querySelectorAll<HTMLButtonElement>('button[data-lm-youtube]:not([data-youtube-ready])').forEach(button => {
  button.dataset.youtubeReady = 'true'
  button.addEventListener('click', () => {
   const template = button.nextElementSibling
   if (!(template instanceof HTMLTemplateElement)) return
   const iframe = template.content.querySelector('iframe')?.cloneNode(true) as HTMLIFrameElement | undefined
   if (!iframe) return
   const url = new URL(iframe.src)
   url.searchParams.set('autoplay', '1')
   iframe.src = url.href
   iframe.loading = 'eager'
   if (!iframe.allow.split(';').some(value => value.trim() === 'autoplay')) iframe.allow += '; autoplay'
   button.replaceWith(iframe)
   template.remove()
   iframe.focus()
  }, { once: true })
 })
}
