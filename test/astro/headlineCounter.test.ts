import { expect, it } from 'vitest'
import { countValue, countLabel, countdownDeadline, countdownValue } from '../../packages/lumen-cms-shared/src/headlineCounter'

it('preserves easing, rounded values, descending counts and affixes', () => {
 expect(countValue(0, 100, .5, 'linear')).toBe(50)
 expect(countValue(0, 100, .5, 'easeInCubic')).toBe(13)
 expect(countValue(0, 100, .5)).toBe(88)
 expect(countValue(100, 0, 1)).toBe(0)
 expect(countValue(-20, 40, 2)).toBe(40)
 expect(countLabel(12, 'Over', 'students')).toBe('Over 12 students')
})
it('interprets CMS deadlines as UTC and matches legacy day/time rounding', () => {
 const deadline = countdownDeadline('2030-02-03 04:05')
 expect(new Date(deadline).toISOString()).toBe('2030-02-03T04:05:00.000Z')
 expect(countdownValue(deadline, deadline - 90061000)).toEqual({ complete: false, text: '1:01:01:01' })
 expect(countdownValue(deadline, deadline - 600)).toEqual({ complete: false, text: '0:00:00:01' })
 expect(countdownValue(deadline, deadline - 400)).toEqual({ complete: true, text: '0:00:00:00' })
 expect(countdownValue(deadline, deadline + 1000).complete).toBe(true)
})
