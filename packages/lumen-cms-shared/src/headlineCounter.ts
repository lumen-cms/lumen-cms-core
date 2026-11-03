export function countValue(start: number, end: number, progress: number, easing = 'easeOutCubic') {
 const t = Math.max(0, Math.min(1, progress))
 const value = easing === 'linear' ? t : easing === 'easeInCubic' ? t ** 3 : 1 - (1 - t) ** 3
 return Math.round(start + (end - start) * value)
}
export function countLabel(value: number, prefix = '', suffix = '') {
 return `${prefix ? prefix + ' ' : ''}${value}${suffix ? ' ' + suffix : ''}`
}
export function countdownDeadline(value: string) {
 const [date, time = '00:00'] = value.split(' ')
 const [year, month, day] = date.split('-').map(Number)
 const [hour, minute] = time.split(':').map(Number)
 return Date.UTC(year, month - 1, day, hour, minute)
}
export function countdownValue(deadline: number, now: number) {
 const seconds = Math.max(0, Math.round((deadline - now) / 1000))
 const days = Math.floor(seconds / 86400)
 const pad = (value: number) => String(value).padStart(2, '0')
 return { complete: seconds <= 0, text: `${days}:${pad(Math.floor(seconds / 3600) % 24)}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}` }
}
