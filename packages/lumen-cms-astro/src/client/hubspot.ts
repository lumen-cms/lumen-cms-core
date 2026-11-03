import { loadExternalScript } from './externalScript'
import { onUnmount } from './lifecycle'

type HubspotWindow = Window & { hbspt?: { forms: { create(options: { region?: string; portalId?: string; formId?: string; target: string }): void } } }
let instance = 0
export function initializeHubspot() {
 document.querySelectorAll<HTMLElement>('[data-lm-hubspot]:not([data-hubspot-state])').forEach(root => {
  root.dataset.hubspotState = 'loading'
  let disposed = false
  onUnmount(root, () => { disposed = true })
  const run = async () => {
   if (root.dataset.lmHubspot === 'form') {
    await loadExternalScript('https://js.hsforms.net/forms/shell.js')
    if (disposed || !root.isConnected) return
    const api = (window as HubspotWindow).hbspt
    if (!api) throw new Error('HubSpot form API unavailable')
    root.replaceChildren()
    api.forms.create({ region: root.dataset.region, portalId: root.dataset.portalId, formId: root.dataset.formId, target: `#${CSS.escape(root.id)}` })
   } else {
    const name = root.dataset.meetingName
    if (!name) { root.dataset.hubspotState = 'empty'; return }
    // The provider scans newly mounted meeting containers when its script executes.
    const query = new URLSearchParams({ id: `${root.id}-${++instance}`, meeting: name, embed: root.dataset.embed || 'true' })
    await loadExternalScript(`https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js?${query}`)
   }
   if (!disposed) root.dataset.hubspotState = 'ready'
  }
  void run().catch(error => { if (!disposed) { root.dataset.hubspotState = 'error'; console.error('HubSpot embed could not load', error) } })
 })
}
