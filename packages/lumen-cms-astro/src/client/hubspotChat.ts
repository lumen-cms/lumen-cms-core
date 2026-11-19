import { onUnmount } from './lifecycle'
import { hasConsent } from './consent'

type Conversations = {
 widget: { status(): { loaded: boolean }; load(options: { widgetOpen: boolean }): void; open(): void; remove(): void }
 on(event: string, callback: () => void): void
 off(event: string, callback: () => void): void
}
type HubspotChatWindow = Window & { HubSpotConversations?: Conversations; hsConversationsOnReady?: (() => void)[] }

export function initializeHubspotChat() {
 const api = window as HubspotChatWindow
 document.querySelectorAll<HTMLElement>('[data-lm-hubspot-chat]:not([data-chat-state])').forEach(root => {
  const button = root.querySelector<HTMLButtonElement>('[data-lm-chat-open]')!
  const status = root.querySelector<HTMLElement>('[data-lm-chat-status]')!
  const label = button.textContent
  const lifecycle = new AbortController()
  let disposed = false, conversations: Conversations | undefined, timer: ReturnType<typeof setTimeout> | undefined
  root.dataset.chatState = 'waiting'
  const reset = () => { clearTimeout(timer); button.disabled = false; button.hidden = false; button.textContent = label; status.textContent = ''; root.dataset.chatState = 'waiting' }
  // HubSpot owns the launcher after loading, including when the chat is minimized.
  // A late widgetLoaded event must also hide the retry button after a timeout.
  const ready = () => { if (disposed) return; clearTimeout(timer); button.disabled = false; button.hidden = true; status.textContent = ''; root.dataset.chatState = 'ready' }
  const open = () => {
   if (disposed || root.dataset.chatState !== 'loading' || !api.HubSpotConversations) return
   if (!conversations) {
    conversations = api.HubSpotConversations
    conversations.on('widgetLoaded', ready)
   }
   if (conversations.widget.status().loaded) { conversations.widget.open(); ready() }
   else conversations.widget.load({ widgetOpen: true })
  }
  const callbacks = api.hsConversationsOnReady ||= []
  callbacks.push(open)
  button.addEventListener('click', () => {
   if (!api.HubSpotConversations && !hasConsent('marketing')) {
    document.querySelector<HTMLButtonElement>('[data-consent-open]')?.click()
    return
   }
   root.dataset.chatState = 'loading'; button.disabled = true; button.textContent = button.dataset.loadingLabel!; status.textContent = button.textContent
   timer = setTimeout(() => {
    if (disposed) return
    reset(); button.textContent = button.dataset.errorLabel!; status.textContent = button.textContent
   }, 15000)
   open()
  }, { signal: lifecycle.signal })
  onUnmount(root, () => {
   disposed = true; lifecycle.abort(); clearTimeout(timer)
   const index = callbacks.indexOf(open); if (index >= 0) callbacks.splice(index, 1)
   conversations?.off('widgetLoaded', ready)
   conversations?.widget.remove()
  })
 })
}
