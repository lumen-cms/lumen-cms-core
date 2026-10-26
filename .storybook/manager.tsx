import React, { useEffect, useState } from 'react'
import { addons, types, useChannel } from 'storybook/manager-api'
import type { LegacyControl } from '../src/storybook/legacyControls'

function LegacyControlsPanel() {
  const [controls, setControls] = useState<LegacyControl[]>([])
  const emit = useChannel({ 'lumen/controls/definitions': setControls })
  useEffect(() => {
    emit('lumen/controls/request')
  }, [emit])
  const change = (key: string, value: unknown) =>
    emit('lumen/controls/change', { key, value })
  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      <button type="button" onClick={() => emit('lumen/controls/reset')}>
        Reset controls
      </button>
      {controls.length === 0 && (
        <p>This story uses the standard Controls panel.</p>
      )}
      {controls.map((c) => {
        const entries = Object.entries(c.options || {})
        const selected = entries.findIndex(([, value]) => value === c.value)
        return (
          <label
            key={c.key}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 1fr) 2fr',
              gap: 16,
              alignItems: 'center'
            }}
          >
            <span>
              <small>{c.group}</small>
              <br />
              {c.label}
            </span>
            {c.type === 'select' || c.type === 'multi' ? (
              <select
                aria-label={`${c.group}: ${c.label}`}
                multiple={c.type === 'multi'}
                value={
                  c.type === 'multi'
                    ? entries.flatMap(([, value], i) =>
                        Array.isArray(c.value) && c.value.includes(value)
                          ? [String(i)]
                          : []
                      )
                    : String(selected)
                }
                onChange={(e) =>
                  change(
                    c.key,
                    c.type === 'multi'
                      ? Array.from(
                          e.target.selectedOptions,
                          (o) => entries[Number(o.value)][1]
                        )
                      : entries[Number(e.target.value)]?.[1]
                  )
                }
              >
                {c.type === 'select' && selected === -1 && (
                  <option value="-1">Please select</option>
                )}
                {entries.map(([label], i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                aria-label={`${c.group}: ${c.label}`}
                type={
                  c.type === 'boolean'
                    ? 'checkbox'
                    : c.type === 'number'
                    ? 'number'
                    : 'text'
                }
                checked={c.type === 'boolean' ? Boolean(c.value) : undefined}
                value={c.type === 'boolean' ? undefined : String(c.value ?? '')}
                onChange={(e) =>
                  change(
                    c.key,
                    c.type === 'boolean'
                      ? e.target.checked
                      : c.type === 'number'
                      ? e.target.value === ''
                        ? undefined
                        : Number(e.target.value)
                      : e.target.value
                  )
                }
              />
            )}
          </label>
        )
      })}
    </div>
  )
}

addons.register('lumen/legacy-controls', () => {
  addons.add('lumen/legacy-controls/panel', {
    type: types.PANEL,
    title: 'Legacy controls',
    render: ({ active }) => (active ? <LegacyControlsPanel /> : null)
  })
})
