/* @flow */
export type RetryConfig = {
  maxAttempts?: number,
  delay?: number,
  backoff?: 'linear' | 'exponential',
  onRetry?: (attempt: number, error: Error) => void
}

export default async function withRetry <T> (
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry
  } = config

  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt < maxAttempts) {
        const waitTime = backoff === 'exponential'
          ? delay * Math.pow(2, attempt - 1)
          : delay * attempt

        if (onRetry) {
          onRetry(attempt, error)
        }

        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError
}
