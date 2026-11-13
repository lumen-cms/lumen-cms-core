import { describe, expect, it } from 'vitest'
import type { ButtonStoryblok } from '../../packages/lumen-cms-shared/src/core/typings/generated/components-schema'
import { accessibleButtonName } from '../../packages/lumen-cms-astro/src/lib/accessibleButtonName'

const imageButton: ButtonStoryblok = { component: 'button', _uid: 'notification', image: 'https://a.storyblok.com/f/69559/500x500/4a57f572ad/notification-icon.gif' }

describe('accessible image button names', () => {
 it('names the SGA custom menu trigger from its menu title', () => {
  expect(accessibleButtonName(imageButton, undefined, 'Infos')).toBe('Infos')
 })
 it('preserves explicit labels and destination names ahead of filenames', () => {
  expect(accessibleButtonName({ ...imageButton, label: 'Neuigkeiten' }, undefined, 'Infos')).toBe('Neuigkeiten')
  expect(accessibleButtonName(imageButton, '/kontakt')).toBe('kontakt')
  expect(accessibleButtonName({ ...imageButton, icon: { name: 'bell' } })).toBe('bell')
 })
 it('uses a readable image filename when there is no action context', () => {
  expect(accessibleButtonName(imageButton)).toBe('notification icon')
  expect(accessibleButtonName({ ...imageButton, label: '  ', image: '/images/Beratung%20buchen_icon.svg?version=2#image' })).toBe('Beratung buchen icon')
  expect(accessibleButtonName({ ...imageButton, image: imageButton.image + '/m/24x0/filters:quality(75)' })).toBe('notification icon')
 })
 it('does not expose broken URLs or invent names for non-image buttons', () => {
  expect(accessibleButtonName({ ...imageButton, image: '/images/%broken.svg' })).toBeUndefined()
  expect(accessibleButtonName({ ...imageButton, image: undefined })).toBeUndefined()
 })
})
