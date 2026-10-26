import { addons } from 'storybook/preview-api'
import { FORCE_RE_RENDER } from 'storybook/internal/core-events'

export type LegacyControl = {
  key: string
  label: string
  group: string
  type: 'text' | 'number' | 'boolean' | 'color' | 'select' | 'multi'
  value: unknown
  options?: Record<string, unknown>
}

const controls = new Map<string, LegacyControl>()
const values = new Map<string, unknown>()
let storyId = ''
let connected = false
let scheduled = false

const publish = () => {
  if (scheduled) return
  scheduled = true
  queueMicrotask(() => {
    scheduled = false
    addons
      .getChannel()
      .emit('lumen/controls/definitions', [...controls.values()])
  })
}

/** Reset per story, retaining edited values during a re-render of that story. */
export function prepareLegacyControls(id: string) {
  if (!connected) {
    const channel = addons.getChannel()
    channel.on('lumen/controls/request', publish)
    channel.on(
      'lumen/controls/change',
      ({ key, value }: { key: string; value: unknown }) => {
        values.set(key, value)
        channel.emit(FORCE_RE_RENDER)
      }
    )
    channel.on('lumen/controls/reset', () => {
      values.clear()
      channel.emit(FORCE_RE_RENDER)
    })
    connected = true
  }
  if (id !== storyId) {
    storyId = id
    controls.clear()
    values.clear()
    publish()
  }
}

function control<T>(
  label: string,
  defaultValue: T,
  type: LegacyControl['type'],
  group = 'Component',
  options?: Record<string, unknown>
): T {
  const key = `${group}::${label}`
  const value = values.has(key) ? (values.get(key) as T) : defaultValue
  controls.set(key, { key, label, group, type, value, options })
  publish()
  return value
}

export const text = (label: string, value: string, group?: string) =>
  control(label, value, 'text', group)
export const color = (label: string, value: string, group?: string) =>
  control(label, value, 'color', group)
export const boolean = (label: string, value: boolean, group?: string) =>
  control(label, value, 'boolean', group)
export const number = (
  label: string,
  value: number | undefined,
  _options = {},
  group?: string
) => control(label, value, 'number', group)
export const select = <T>(
  label: string,
  options: Record<string, unknown>,
  value: T,
  group?: string
) => control(label, value, 'select', group, options)
export const optionsKnob = <T>(
  label: string,
  options: Record<string, unknown>,
  value: T,
  settings: { display: string },
  group?: string
) =>
  control(
    label,
    value,
    ['inline-check', 'multi-select'].includes(settings.display)
      ? 'multi'
      : 'select',
    group,
    options
  )
