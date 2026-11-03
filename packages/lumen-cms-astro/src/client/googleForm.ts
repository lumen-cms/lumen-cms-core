import { submitToGoogleForms } from 'lumen-cms-shared/core/vendor/google-forms/submitToGoogleForms'
import type { GoogleForm } from 'lumen-cms-shared/core/vendor/google-forms/types'

export function googleFormValues(form: HTMLFormElement, structure: GoogleForm) {
 const values = new FormData(form)
 const data: Record<string, string | string[]> = {}
 for (const field of structure.fields) {
  const value = values.get(field.id)
  if (field.type === 'CHECKBOX') data[field.id] = values.getAll(field.id).map(String)
  else if (field.type === 'DATE' && typeof value === 'string' && value) {
   // The previous date-fns picker submitted a local Date through String(Date).
   const [year, month, day] = value.split('-').map(Number)
   data[field.id] = String(new Date(year, month - 1, day))
  } else data[field.id] = typeof value === 'string' ? value : ''
 }
 return data
}

export function initializeGoogleForms() {
 document.querySelectorAll<HTMLElement>('[data-lm-google-form]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  const structure: GoogleForm = JSON.parse(root.dataset.structure!)
  const form = root.querySelector<HTMLFormElement>('form')!
  const success = root.querySelector<HTMLElement>('[data-form-success]')!
  const error = root.querySelector<HTMLElement>('[data-form-error]')!
  let submitting = false
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]').forEach(input => {
   input.addEventListener('invalid', () => { if (input.validity.valueMissing && root.dataset.requiredMessage) input.setCustomValidity(root.dataset.requiredMessage) })
   input.addEventListener('input', () => input.setCustomValidity(''))
   input.addEventListener('change', () => input.setCustomValidity(''))
  })
  form.addEventListener('submit', async event => {
   event.preventDefault()
   if (submitting || !structure.action || root.dataset.api !== 'true' || new FormData(form).get('current_address')) return
   submitting = true
   form.setAttribute('aria-busy', 'true')
   error.hidden = true
   const buttons = form.querySelectorAll<HTMLButtonElement>('[type="submit"]')
   buttons.forEach(button => button.disabled = true)
   try {
    const confirmed = await submitToGoogleForms(structure, googleFormValues(form, structure))
    if (confirmed) {
     const tracking = window as Window & { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void }
     tracking.gtag?.('event', 'generate_lead', { event_category: 'Google Form Submit', event_label: structure.action, content_id: location.pathname })
     tracking.fbq?.('track', 'Lead')
    }
    // Preserve the existing opaque no-cors response behavior.
    form.hidden = true
    success.hidden = false
    success.focus()
   } catch {
    error.hidden = false
   } finally {
    submitting = false
    form.removeAttribute('aria-busy')
    buttons.forEach(button => button.disabled = false)
   }
  })
 })
}
