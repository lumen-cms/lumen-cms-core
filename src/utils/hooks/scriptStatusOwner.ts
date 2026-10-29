// A loading script outlives its React consumers. Its document owns this recorder
// until the request settles or the script is removed, whichever happens first.
// No component state or subscriber callback is retained here.
class ScriptStatusOwner {
  private pending = new Map<HTMLScriptElement, () => void>()
  private observer?: MutationObserver

  track(script: HTMLScriptElement) {
    if (
      !script.isConnected ||
      script.getAttribute('data-status') !== 'loading' ||
      this.pending.has(script)
    )
      return

    const release = () => {
      script.removeEventListener('load', settle)
      script.removeEventListener('error', settle)
      this.pending.delete(script)
      if (!this.pending.size) {
        this.observer?.disconnect()
        this.observer = undefined
      }
    }
    const settle = (event: Event) => {
      script.setAttribute(
        'data-status',
        event.type === 'load' ? 'ready' : 'error'
      )
      release()
    }
    this.pending.set(script, release)
    script.addEventListener('load', settle)
    script.addEventListener('error', settle)
    if (!this.observer) {
      this.observer = new MutationObserver(() => {
        for (const [element, dispose] of this.pending) {
          if (!element.isConnected) dispose()
        }
      })
      this.observer.observe(script.ownerDocument, {
        childList: true,
        subtree: true
      })
    }
  }
}

const owners = new WeakMap<Document, ScriptStatusOwner>()

export function trackPendingScriptStatus(script: HTMLScriptElement) {
  let owner = owners.get(script.ownerDocument)
  if (!owner) {
    owner = new ScriptStatusOwner()
    owners.set(script.ownerDocument, owner)
  }
  owner.track(script)
}
