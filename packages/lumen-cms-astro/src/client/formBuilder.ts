export function formBuilderValues(form: HTMLFormElement): Record<string, unknown> {
 const values = new FormData(form)
 const result: Record<string, unknown> = Object.fromEntries(values)
 form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-value-kind]').forEach(input => {
  result[input.name] = input.dataset.valueKind === 'boolean' ? (input as HTMLInputElement).checked : values.getAll(input.name).map(String)
 })
 delete result.current_address
 return result
}
export function initializeFormBuilders() {
 document.querySelectorAll<HTMLElement>('[data-lm-form-builder]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  const form = root.querySelector<HTMLFormElement>('form')!
  const success = root.querySelector<HTMLElement>('[data-form-success]')!
  const error = root.querySelector<HTMLElement>('[data-form-error]')!
  const groups = root.querySelectorAll<HTMLElement>('[data-required-group]')
  groups.forEach(group => {
   const inputs = Array.from(group.querySelectorAll<HTMLInputElement>('input'))
   const validate = () => inputs[0]?.setCustomValidity(inputs.some(input => input.checked) ? '' : 'Please select at least one option')
   group.addEventListener('change', validate)
   // Native reset restores checked states after the reset event is dispatched.
   form.addEventListener('reset', () => queueMicrotask(validate))
   validate()
  })
  let submitting = false
  const showSuccess = () => { form.hidden = true; success.hidden = false; success.focus() }
  form.addEventListener('submit', async event => {
   event.preventDefault()
   if (submitting) return
   if (new FormData(form).get('current_address')) { showSuccess(); return }
   submitting = true
   form.setAttribute('aria-busy', 'true')
   const buttons = form.querySelectorAll<HTMLButtonElement>('[type="submit"]')
   buttons.forEach(button => button.disabled = true)
   const data = formBuilderValues(form)
   const body = Object.fromEntries(Object.entries({ ...data, ...JSON.parse(root.dataset.additional || '{}') }).filter(([, value]) => !!value))
   const endpoint = root.dataset.endpoint
   const tracking = window as Window & { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void }
   try {
    if (endpoint) {
     const response = await fetch(endpoint.startsWith('http') ? endpoint : location.origin + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
     const result: unknown = await response.json()
     const eventName = response.status === 200 ? 'generate_lead' : 'exception'
     tracking.gtag?.('event', eventName, { event_category: 'Form Submit', event_label: endpoint, content_id: location.pathname })
     if (response.status !== 200) { error.textContent = typeof result === 'string' ? result : JSON.stringify(result); error.hidden = false; form.hidden = true }
     else { tracking.fbq?.('track', 'Lead'); showSuccess() }
    } else showSuccess()
    // Native replacement for application-level onSubmit listeners.
    root.dispatchEvent(new CustomEvent('lumen:form-submit', { bubbles: true, detail: data }))
   } catch (cause) {
    error.textContent = cause instanceof Error ? cause.message : String(cause)
    error.hidden = false
    form.hidden = true
   } finally {
    submitting = false
    form.removeAttribute('aria-busy')
    buttons.forEach(button => button.disabled = false)
   }
  })
 })
}
