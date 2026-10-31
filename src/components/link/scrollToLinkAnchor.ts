import type { SyntheticEvent } from 'react'

// Retain the async boundary: DOM failures reject rather than throw into React.
export async function scrollToLinkAnchor(
  href: string,
  event: Pick<SyntheticEvent<HTMLAnchorElement>, 'target' | 'preventDefault'>
): Promise<void> {
  const [, anchorName] = href.split('#')
  if (anchorName) {
    const destination = document.getElementById(anchorName)
    if (destination) {
      if ((event.target as Element).closest('.MuiDrawer-root')) {
        return
      }
      event.preventDefault()
      destination.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
