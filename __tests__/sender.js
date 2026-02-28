/* @flow */
/* global jest, test, expect */
import Sender from '../src/sender'
import strategyNoFallback from '../src/strategies/providers/no-fallback'
import logger from '../src/util/logger'

jest.mock('../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const providers = {
  email: [{ id: 'email-provider', send: jest.fn() }],
  sms: [{ id: 'sms-provider', send: async () => '24' }],
  voice: [{ id: 'voice-provider', send: async () => '24' }],
  push: [], // no push provider
  webpush: [{ id: 'webpush-provider', send: () => { throw new Error('webpush test error') } }]
}
const strategies = {
  email: strategyNoFallback,
  sms: strategyNoFallback,
  voice: strategyNoFallback,
  push: strategyNoFallback,
  webpush: strategyNoFallback
}

const sender = new Sender(['email', 'sms', 'voice', 'push', 'webpush'], providers, strategies)

test('Sender should send all notifications.', async () => {
  const metadata = { id: '24' }
  const request = {
    metadata,
    email: { from: 'me@example.com', to: 'john@example.com', subject: 'Hi John', html: '<b>Hello John! How are you?</b>' },
    sms: { from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?' },
    voice: { from: '+15000000000', to: '+15000000001', url: 'https://notifme.github.io' },
    push: { registrationToken: 'xxxxx', title: 'Hi John', body: 'Hello John! How are you?' },
    webpush: { subscription: { keys: { auth: 'xxxxx', p256dh: 'xxxxx' }, endpoint: 'xxxxx' }, title: 'Hi John', body: 'Hello John! How are you?' }
  }

  const result = await sender.send(request)
  expect(providers.email[0].send).toBeCalledWith({ ...metadata, ...request.email })
  expect(logger.warn).toBeCalledWith('No provider registered for channel "push". Using logger.')
  expect(logger.info).toBeCalledWith('[PUSH] Sent by "push-logger-provider":')
  expect(logger.info).toBeCalledWith({ id: '24', registrationToken: '***', title: 'Hi John', body: 'Hello John! How are you?' })
  expect(logger.warn).toBeCalledWith('[webpush-provider] webpush test error')
  expect(result).toEqual({
    status: 'error',
    channels: {
      email: { id: undefined, providerId: 'email-provider' },
      sms: { id: '24', providerId: 'sms-provider' },
      voice: { id: '24', providerId: 'voice-provider' },
      push: { id: (result.channels: any).push.id, providerId: 'push-logger-provider' },
      webpush: { id: undefined, providerId: 'webpush-provider' }
    },
    errors: {
      webpush: 'webpush test error'
    }
  })

  expect(await sender.send({ sms: request.sms })).toEqual({
    status: 'success',
    channels: {
      sms: { id: '24', providerId: 'sms-provider' }
    }
  })
})

test('Sender should call beforeSend hook.', async () => {
  const beforeSend = jest.fn((request) => {
    return { ...request, metadata: { ...request.metadata, modified: true } }
  })
  const senderWithHooks = new Sender(['email'], providers, strategies, { beforeSend })

  await senderWithHooks.send({ email: { from: 'test@example.com', to: 'test2@example.com', subject: 'Test' } })

  expect(beforeSend).toBeCalledWith({ email: { from: 'test@example.com', to: 'test2@example.com', subject: 'Test' } })
  expect(providers.email[0].send).toBeCalledWith({ modified: true, from: 'test@example.com', to: 'test2@example.com', subject: 'Test' })
})

test('Sender should call afterSend hook.', async () => {
  const afterSend = jest.fn((result) => {
    return { ...result, info: { logged: true } }
  })
  const senderWithHooks = new Sender(['sms'], providers, strategies, { afterSend })

  const result = await senderWithHooks.send({ sms: { from: '+15000000000', to: '+15000000001', text: 'Test' } })

  expect(afterSend).toBeCalled()
  expect(result.info).toEqual({ logged: true })
})

test('Sender should call per-channel beforeSend hook.', async () => {
  const emailBeforeSend = jest.fn((request) => ({ ...request, custom: 'email-hook' }))
  const senderWithHooks = new Sender(['email', 'sms'], providers, strategies, {
    channels: {
      email: { beforeSend: emailBeforeSend }
    }
  })

  // $FlowIgnore - testing partial request
  await senderWithHooks.send({ email: { from: 'test@example.com', to: 'test2@example.com', subject: 'Test' } })

  expect(emailBeforeSend).toBeCalledWith({ from: 'test@example.com', to: 'test2@example.com', subject: 'Test' })
  expect(providers.email[0].send).toBeCalledWith({ from: 'test@example.com', to: 'test2@example.com', subject: 'Test', custom: 'email-hook' })
})

test('Sender should call per-channel afterSend hook.', async () => {
  const emailAfterSend = jest.fn()
  const senderWithHooks = new Sender(['email'], providers, strategies, {
    channels: {
      email: { afterSend: emailAfterSend }
    }
  })

  // $FlowIgnore - testing partial request
  await senderWithHooks.send({ email: { from: 'test@example.com', to: 'test2@example.com', subject: 'Test' } })

  expect(emailAfterSend).toBeCalled()
})

test('Sender should call onError hook on failure.', async () => {
  const onError = jest.fn()
  const senderWithHooks = new Sender(['webpush'], providers, strategies, { onError })

  // $FlowIgnore - testing error case
  await senderWithHooks.send({ webpush: { subscription: { endpoint: 'test', keys: { auth: 'a', p256dh: 'b' } }, title: 'Test', body: 'Test body' } })

  expect(onError).toBeCalled()
  expect(onError.mock.calls[0][1]).toBe('webpush')
})

test('Sender should call per-channel onError hook.', async () => {
  const channelOnError = jest.fn()
  const globalOnError = jest.fn()
  const senderWithHooks = new Sender(['webpush'], providers, strategies, {
    onError: globalOnError,
    channels: {
      webpush: { onError: channelOnError }
    }
  })

  // $FlowIgnore - testing error case
  await senderWithHooks.send({ webpush: { subscription: { endpoint: 'test', keys: { auth: 'a', p256dh: 'b' } }, title: 'Test', body: 'Test body' } })

  expect(channelOnError).toBeCalled()
  expect(globalOnError).not.toBeCalled()
})

test('Sender should enforce global rate limit.', async () => {
  const senderWithRateLimit = new Sender(['sms'], providers, strategies, {}, {
    global: { max: 0, window: 60 }
  })

  // $FlowIgnore - testing rate limit
  const result = await senderWithRateLimit.send({ sms: { from: '+15000000000', to: '+15000000001', text: 'Test' } })

  expect(result.status).toBe('error')
  expect(result.errors.sms).toContain('Rate limit exceeded')
})

test('Sender should enforce channel rate limit.', async () => {
  const senderWithRateLimit = new Sender(['sms'], providers, strategies, {}, {
    sms: { max: 0, window: 60 }
  })

  // $FlowIgnore - testing rate limit
  const result = await senderWithRateLimit.send({ sms: { from: '+15000000000', to: '+15000000001', text: 'Test' } })

  expect(result.status).toBe('error')
  expect(result.errors.sms).toContain('Rate limit exceeded')
})

test('Sender should allow request when under rate limit.', async () => {
  const senderWithRateLimit = new Sender(['sms'], providers, strategies, {}, {
    sms: { max: 10, window: 60 }
  })

  const result = await senderWithRateLimit.send({ sms: { from: '+15000000000', to: '+15000000001', text: 'Test' } })

  expect(result.status).toBe('success')
})
