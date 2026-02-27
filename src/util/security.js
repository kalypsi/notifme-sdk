/* @flow */

const SENSITIVE_KEY_REGEX = /(api[-_]?key|auth|authorization|token|secret|password|pass|key|credential|cookie)/i

function maskString (value: string): string {
  if (value.length <= 8) return '***'
  return `${value.slice(0, 2)}***${value.slice(-2)}`
}

export function redactSensitive (value: any): any {
  if (Array.isArray(value)) {
    return value.map(redactSensitive)
  }

  if (!value || typeof value !== 'object') {
    return typeof value === 'string' && value.length > 4096
      ? `${value.slice(0, 4096)}...[truncated]`
      : value
  }

  return Object.keys(value).reduce((acc, key) => {
    const item = value[key]
    if (SENSITIVE_KEY_REGEX.test(key)) {
      acc[key] = typeof item === 'string' ? maskString(item) : '***'
      return acc
    }
    acc[key] = redactSensitive(item)
    return acc
  }, {})
}

function getAllowedHosts (): string[] {
  const value = process.env.NOTIFME_ALLOWED_HOSTS || ''
  return value
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
}

function isAllowedByPattern (hostname: string, pattern: string): boolean {
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1)
    return hostname.endsWith(suffix)
  }
  return hostname === pattern
}

export function assertSafeUrl (rawUrl: string, label: string): string {
  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch (error) {
    throw new Error(`Invalid ${label} URL.`)
  }

  const allowInsecure = process.env.NOTIFME_ALLOW_INSECURE_URLS === 'true'
  if (!allowInsecure && parsed.protocol !== 'https:') {
    throw new Error(`${label} URL must use HTTPS.`)
  }

  const hostname = parsed.hostname.toLowerCase()
  const allowedHosts = getAllowedHosts()
  if (allowedHosts.length > 0 && !allowedHosts.some((pattern) => isAllowedByPattern(hostname, pattern))) {
    throw new Error(`${label} URL host "${hostname}" is not in NOTIFME_ALLOWED_HOSTS.`)
  }

  return parsed.toString()
}

export function sanitizeErrorMessage (error: any): string {
  if (!error) return 'Unknown error'
  const message = error && error.message ? String(error.message) : String(error)
  return message.replace(/(api[-_]?key|token|secret|password)=([^&\s]+)/gi, '$1=***')
}
