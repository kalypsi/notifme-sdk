/* @flow */
import fetch from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'

const DEFAULT_TIMEOUT_MS = 10000
const DEFAULT_RETRY_DELAY_MS = 250

function getTimeoutMs (): number {
  const raw = Number(process.env.NOTIFME_HTTP_TIMEOUT_MS)
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS
}

function getRetryCount (): number {
  const raw = Number(process.env.NOTIFME_HTTP_RETRIES)
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0
}

function getRetryDelayMs (): number {
  const raw = Number(process.env.NOTIFME_HTTP_RETRY_DELAY_MS)
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_RETRY_DELAY_MS
}

function sleep (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError (error: any): boolean {
  if (!error) return false
  if (error.name === 'AbortError') return true
  const retryableCodes = ['ECONNRESET', 'EAI_AGAIN', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED']
  return retryableCodes.includes(error.code)
}

export default async (url: string, { ...options }: Object = {}) => {
  if (!options.agent && process.env.NOTIFME_HTTP_PROXY) {
    options.agent = new HttpsProxyAgent(process.env.NOTIFME_HTTP_PROXY)
  }

  const retries = getRetryCount()
  let attempt = 0

  while (attempt <= retries) {
    if (!options.signal) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), getTimeoutMs())
      options.signal = controller.signal
      try {
        return await fetch(url, options)
      } catch (error) {
        if (attempt >= retries || !isRetryableError(error)) throw error
      } finally {
        clearTimeout(timeout)
        delete options.signal
      }
    } else {
      try {
        return await fetch(url, options)
      } catch (error) {
        if (attempt >= retries || !isRetryableError(error)) throw error
      }
    }

    attempt += 1
    await sleep(getRetryDelayMs() * attempt)
  }

  return fetch(url, options)
}
