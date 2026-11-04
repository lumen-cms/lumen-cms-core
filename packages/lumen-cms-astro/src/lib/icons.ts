/// <reference path="./mdi-icons.d.ts" />
import icons from 'virtual:lumen-mdi-icons'
import { inlineSvg } from './svg'

const aliases: Record<string, string> = { call: 'phone', people: 'account-multiple', access_time: 'clock-outline', compare_arrows: 'compare', keyboard_arrow_down: 'chevron-down', 'laptop-chromebook': 'laptop', laptop_chromebook: 'laptop' }

export async function iconSvg(name?: string, url?: string): Promise<string> {
 // Authored URLs always take precedence and retain the remote SVG sanitizer.
 if (url) return inlineSvg(url.startsWith('//') ? `https:${url}` : url)
 if (!name) return ''
 const normalized = (Object.hasOwn(aliases, name) ? aliases[name] : name).replaceAll('_', '-')
 if (!Object.hasOwn(icons, normalized)) throw new Error(`Unknown MDI icon: ${name}`)
 return icons[normalized]
}
