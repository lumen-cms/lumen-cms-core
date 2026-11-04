import { loadExternalScript } from './externalScript'
import { onUnmount } from './lifecycle'
type ChatWindow = Window & {
 Tawk_API?: { onLoad?: () => void; maximize?: () => void; showWidget?: () => void; hideWidget?: () => void }
 fbAsyncInit?: () => void
 FB?: { init(options: { xfbml: boolean; version: string }): void; CustomerChat?: { show(): void; hide(): void } }
}
export function initializeChat() {
 const api = window as ChatWindow
 document.querySelectorAll<HTMLElement>('[data-lm-chat]:not([data-chat-state])').forEach(root => {
  const button = root.querySelector<HTMLButtonElement>('[data-lm-chat-open]')
  if (!button) return
  if (root.dataset.preview === 'true') { root.dataset.chatState = 'preview'; button.disabled = true; return }
  root.dataset.chatState = 'waiting'
  const facebook = root.dataset.lmChat === 'facebook'
  const account = root.dataset.account
  const lifecycle = new AbortController()
  let restore: (() => void) | undefined
  let disposed = false, timer: ReturnType<typeof setTimeout> | undefined
  const status = root.querySelector<HTMLElement>('[data-lm-chat-status]')
  const fail = () => {
   if (disposed) return
   clearTimeout(timer); root.dataset.chatState = 'error'; button.disabled = false; button.hidden = false
   button.textContent = button.dataset.errorLabel || 'Retry chat'
   if (status) status.textContent = button.textContent
  }
  const ready = () => {
   if (disposed || root.dataset.chatState !== 'loading') return
   if (facebook) api.FB?.CustomerChat?.show()
   else { api.Tawk_API?.showWidget?.(); api.Tawk_API?.maximize?.() }
   clearTimeout(timer); root.dataset.chatState = 'ready'; button.hidden = true; button.disabled = false
   if (status) status.textContent = ''
  }
  const activate = async () => {
   if (disposed || !account || !['waiting', 'error'].includes(root.dataset.chatState!)) return
   restore?.()
   root.dataset.chatState = 'loading'; button.disabled = true; button.textContent = button.dataset.loadingLabel || 'Loading chat…'
   if (status) status.textContent = button.textContent
   timer = setTimeout(fail, 15000)
   if (facebook) {
    if (!root.querySelector('.fb-customerchat')) {
     const container = document.createElement('div')
     container.className = 'fb-customerchat'; container.setAttribute('attribution', 'setup_tool'); container.setAttribute('page_id', account); root.append(container)
    }
    const previous = api.fbAsyncInit
    const initialize = () => { previous?.(); if (!disposed) { api.FB?.init({ xfbml: true, version: 'v8.0' }); ready() } }
    api.fbAsyncInit = initialize
    restore = () => { if (api.fbAsyncInit === initialize) api.fbAsyncInit = previous }
    if (api.FB) { initialize(); return }
   } else {
    const tawk = api.Tawk_API ||= {}
    if (tawk.maximize) { ready(); return }
    const previous = tawk.onLoad
    const initialize = () => { previous?.(); ready() }
    tawk.onLoad = initialize
    restore = () => { if (tawk.onLoad === initialize) tawk.onLoad = previous }
   }
   try {
    await loadExternalScript(facebook ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js' : `https://embed.tawk.to/${account}/default`, facebook ? { id: 'facebook-jssdk' } : undefined)
   } catch (error) { if (!disposed) { fail(); console.error('Chat widget could not load', error) } }
  }
  button.addEventListener('click', () => { void activate() }, { signal: lifecycle.signal })
  onUnmount(root, () => {
   disposed = true; lifecycle.abort(); restore?.(); clearTimeout(timer)
   if (facebook) api.FB?.CustomerChat?.hide()
   else api.Tawk_API?.hideWidget?.()
  })
 })
}
