import { authStore } from './auth'
export function initializeAccountForms() {
 document.querySelectorAll<HTMLElement>('[data-lm-account]:not([data-initialized])').forEach(root => {
  root.dataset.initialized = 'true'
  const form = root.querySelector('form')!, fieldset = root.querySelector('fieldset')!, status = root.querySelector<HTMLElement>('[role=status]')!
  const de = root.dataset.locale === 'de'
  const submit = async (method: 'PATCH' | 'DELETE') => {
   if (fieldset.disabled) return
   if (method === 'DELETE' && !confirm(de ? 'Konto wirklich löschen?' : 'Really delete your account?')) return
   const body = Object.fromEntries(new FormData(form))
   fieldset.disabled = true; status.textContent = de ? 'Wird verarbeitet…' : 'Processing…'
   try {
    const response = await fetch('/api/account', { method, headers: { 'Content-Type': 'application/json', 'X-Lumen-CSRF': '1' }, body: method === 'PATCH' ? JSON.stringify(body) : undefined })
    if (!response.ok) throw new Error('Account request failed')
    const data = await response.json()
    if (method === 'DELETE') { authStore.clear(); window.location.assign(data.redirect); return }
    await authStore.load()
    status.textContent = de ? 'Profil aktualisiert.' : 'Profile updated.'
   } catch { status.textContent = de ? 'Anfrage fehlgeschlagen. Bitte erneut versuchen.' : 'Request failed. Please try again.' }
   finally { fieldset.disabled = false }
  }
  form.addEventListener('submit', event => { event.preventDefault(); void submit('PATCH') })
  root.querySelector('[data-account-delete]')?.addEventListener('click', event => { if ((event.target as Element).closest('button')) void submit('DELETE') })
 })
}
