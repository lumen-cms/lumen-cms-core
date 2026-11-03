import { loadExternalScript } from './externalScript'
import { onUnmount } from './lifecycle'
type ChatWindow = Window & {
 Tawk_API?: { isChatHidden(): boolean; showWidget(): void; hideWidget(): void }
 fbAsyncInit?: () => void
 FB?: { init(options: { xfbml: boolean; version: string }): void; CustomerChat?: { show(): void; hide(): void } }
}
export function initializeChat() {
 const api = window as ChatWindow
 document.querySelectorAll<HTMLElement>('[data-lm-chat]:not([data-chat-state])').forEach(root => {
  if (root.dataset.preview === 'true') { root.dataset.chatState = 'preview'; return }
  root.dataset.chatState = 'waiting'
  const facebook = root.dataset.lmChat === 'facebook'
  const account = root.dataset.account
  const lifecycle = new AbortController()
  let restore: (() => void) | undefined
  let disposed = false
  if (facebook) api.FB?.CustomerChat?.show()
  else if (api.Tawk_API?.isChatHidden()) api.Tawk_API.showWidget()
  const activate = async () => {
   if (disposed || !account || root.dataset.chatState !== 'waiting') return
   root.dataset.chatState = 'loading'
   if (facebook) {
    const container = document.createElement('div')
    container.className = 'fb-customerchat'; container.setAttribute('attribution', 'setup_tool'); container.setAttribute('page_id', account)
    root.append(container)
    const previous = api.fbAsyncInit
    const initialize = () => api.FB?.init({ xfbml: true, version: 'v8.0' })
    api.fbAsyncInit = initialize
    restore = () => { if (api.fbAsyncInit === initialize) api.fbAsyncInit = previous }
    if (api.FB) initialize()
   }
   try {
    await loadExternalScript(facebook ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js' : `https://embed.tawk.to/${account}/default`, facebook ? { id: 'facebook-jssdk' } : undefined)
    if (!disposed) root.dataset.chatState = 'ready'
   } catch (error) { if (!disposed) { root.dataset.chatState = 'error'; console.error('Chat widget could not load', error) } }
  }
  if (root.dataset.eager === 'true') void activate()
  else window.addEventListener('scroll', () => { void activate() }, { once: true, passive: true, signal: lifecycle.signal })
  onUnmount(root, () => {
   disposed = true; lifecycle.abort(); restore?.()
   if (facebook) api.FB?.CustomerChat?.hide()
   else api.Tawk_API?.hideWidget()
  })
 })
}
