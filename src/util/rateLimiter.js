/* @flow */
type RateLimitConfig = {
  max: number,
  window: number // in seconds
}

type RateLimitEntry = {
  count: number,
  resetTime: number
}

export default class RateLimiter {
  limits: { [key: string]: RateLimitEntry }
  configs: { [key: string]: RateLimitConfig }

  constructor (configs: { [key: string]: RateLimitConfig }) {
    this.limits = {}
    this.configs = configs
  }

  async check (key: string): Promise<{ allowed: boolean, remaining: number, resetIn: number }> {
    const config = this.configs[key]
    if (!config) {
      return { allowed: true, remaining: config ? config.max : 999999, resetIn: 0 }
    }

    const now = Date.now()
    const entry = this.limits[key]

    if (!entry || now >= entry.resetTime) {
      this.limits[key] = {
        count: 0,
        resetTime: now + (config.window * 1000)
      }
    }

    const current = this.limits[key]
    const allowed = current.count < config.max
    const remaining = Math.max(0, config.max - current.count - (allowed ? 1 : 0))
    const resetIn = Math.max(0, Math.ceil((current.resetTime - now) / 1000))

    if (allowed) {
      current.count++
    }

    return { allowed, remaining, resetIn }
  }

  reset (key: string) {
    delete this.limits[key]
  }

  resetAll () {
    this.limits = {}
  }
}
