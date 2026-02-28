/* @flow */
/* global test, expect */
import RateLimiter from '../../src/util/rateLimiter'

test('RateLimiter should allow requests under limit.', async () => {
  const limiter = new RateLimiter({ test: { max: 2, window: 60 } })

  const result1 = await limiter.check('test')
  expect(result1.allowed).toBe(true)
  expect(result1.remaining).toBe(1)

  const result2 = await limiter.check('test')
  expect(result2.allowed).toBe(true)
  expect(result2.remaining).toBe(0)
})

test('RateLimiter should block requests over limit.', async () => {
  const limiter = new RateLimiter({ test: { max: 1, window: 60 } })

  await limiter.check('test')
  const result = await limiter.check('test')

  expect(result.allowed).toBe(false)
  expect(result.remaining).toBe(0)
})

test('RateLimiter should reset after window.', async () => {
  const limiter = new RateLimiter({ test: { max: 1, window: 0 } })

  await limiter.check('test')
  await new Promise(resolve => setTimeout(resolve, 10))
  const result = await limiter.check('test')

  expect(result.allowed).toBe(true)
})

test('RateLimiter should return resetIn value.', async () => {
  const limiter = new RateLimiter({ test: { max: 1, window: 60 } })

  await limiter.check('test')
  const result = await limiter.check('test')

  expect(result.resetIn).toBeGreaterThan(0)
})

test('RateLimiter should handle missing config.', async () => {
  const limiter = new RateLimiter({})

  const result = await limiter.check('test')
  expect(result.allowed).toBe(true)
})

test('RateLimiter should reset specific key.', async () => {
  const limiter = new RateLimiter({ test: { max: 1, window: 60 } })

  await limiter.check('test')
  limiter.reset('test')
  const result = await limiter.check('test')

  expect(result.allowed).toBe(true)
  // remaining is 0 because this request counts toward the limit
})

test('RateLimiter should reset all keys.', async () => {
  const limiter = new RateLimiter({ test1: { max: 1, window: 60 }, test2: { max: 1, window: 60 } })

  await limiter.check('test1')
  await limiter.check('test2')
  limiter.resetAll()

  const result1 = await limiter.check('test1')
  const result2 = await limiter.check('test2')

  expect(result1.allowed).toBe(true)
  expect(result2.allowed).toBe(true)
})
