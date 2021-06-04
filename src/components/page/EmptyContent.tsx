import { LmComponentRender } from '@LmComponentRender'
import React from 'react'
import { useSettings } from '../provider/SettingsPageProvider'

export default function EmptyContent() {
  const settings = useSettings()
  return (
    <>
      {settings.promotion?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
      <div
        style={{
          padding: 20,
          textAlign: 'center'
        }}
      >
        There is no content yet...
      </div>
    </>
  )
}
