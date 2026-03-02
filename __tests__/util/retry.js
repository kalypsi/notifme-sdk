/* @flow */
/* global test, expect */
import withRetry from '../../src/util/retry'

test('withRetry succeeds on first attempt', async () => {
  const result = await withRetry(async () => 'success', { maxAttempts: 3 })
  expect(result).toBe('success')
})

test('withRetry retries then succeeds', async () => {
  let attempts = 0
  const result = await withRetry(async () => {
    attempts++
    if (attempts < 3) throw new Error('fail')
    return 'success'
  }, { maxAttempts: 3, delay: 10 })

  expect(result).toBe('success')
  expect(attempts).toBe(3)
})

test('withRetry throws after max attempts', async () => {
  expect.assertions(1)
  try {
    await withRetry(async () => {
      throw new Error('always fails')
    }, { maxAttempts: 3, delay: 10 })
  } catch (error) {
    expect(error.message).toBe('always fails')
  }
})

test('withRetry calls onRetry callback on failure', async () => {
  let retryCalled = false
  try {
    await withRetry(async () => {
      throw new Error('fail')
    }, { maxAttempts: 2, delay: 10, onRetry: () => { retryCalled = true } })
  } catch (e) {}

  expect(retryCalled).toBe(true)
})

test('withRetry uses exponential backoff', async () => {
  let attempts = 0
  const start = Date.now()

  await withRetry(async () => {
    attempts++
    if (attempts < 3) throw new Error('fail')
    return 'success'
  }, { maxAttempts: 3, delay: 30 })

  const elapsed = Date.now() - start
  // Exponential: 30 + 60 = 90ms minimum
  expect(elapsed).toBeGreaterThanOrEqual(90)
})

test('withRetry uses linear backoff', async () => {
  let attempts = 0
  const start = Date.now()

  await withRetry(async () => {
    attempts++
    if (attempts < 3) throw new Error('fail')
    return 'success'
  }, { maxAttempts: 3, delay: 30, backoff: 'linear' })

  const elapsed = Date.now() - start
  // Linear: 30 + 30 = 60ms minimum
  expect(elapsed).toBeGreaterThanOrEqual(60)
})
