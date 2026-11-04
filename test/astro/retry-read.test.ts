import { afterEach, expect, it, vi } from 'vitest'
import { retryRead } from '../../packages/lumen-cms-shared/src/server/retryRead'
afterEach(() => vi.useRealTimers())
it('retries transient reads and returns the successful result', async () => {
 vi.useFakeTimers()
 const read = vi.fn().mockRejectedValueOnce(new TypeError('fetch failed')).mockResolvedValue('ok')
 const result = retryRead(read)
 await vi.runAllTimersAsync()
 expect(await result).toBe('ok')
 expect(read).toHaveBeenCalledTimes(2)
})
it('does not retry permanent API failures', async () => {
 const read = vi.fn().mockRejectedValue({ response: { status: 404 } })
 await expect(retryRead(read)).rejects.toMatchObject({ response: { status: 404 } })
 expect(read).toHaveBeenCalledOnce()
})
it('fails after three attempts instead of hiding unavailable data', async () => {
 vi.useFakeTimers()
 const error = new TypeError('fetch failed')
 const read = vi.fn().mockRejectedValue(error)
 const result = expect(retryRead(read)).rejects.toBe(error)
 await vi.runAllTimersAsync()
 await result
 expect(read).toHaveBeenCalledTimes(3)
})
