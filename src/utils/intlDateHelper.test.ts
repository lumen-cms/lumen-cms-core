import { expect, it } from 'vitest'
import { getDateFormatIntlOption } from './intlDateHelper'
import type { DateTimeFormatStoryblok } from '../typings/generated/components-schema'

it.each([undefined, null])(
  'uses defaults safely when options are %s',
  (options) => {
    // Include null from external CMS data despite the narrower TypeScript API.
    expect(
      getDateFormatIntlOption(options as unknown as DateTimeFormatStoryblok)
    ).toEqual({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric'
    })
    expect(
      getDateFormatIntlOption(
        options as unknown as DateTimeFormatStoryblok,
        true
      )
    ).toEqual({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
)

it('handles component options, hidden time, and date/time styles through their guarded branches', () => {
  expect(
    getDateFormatIntlOption({
      hide_time: true,
      month: 'long'
    } as DateTimeFormatStoryblok)
  ).toEqual({ year: 'numeric', month: 'long', day: '2-digit' })
  expect(
    getDateFormatIntlOption({
      dateStyle: 'long',
      timeStyle: 'short'
    } as DateTimeFormatStoryblok)
  ).toEqual({ dateStyle: 'long', timeStyle: 'short' })
})
