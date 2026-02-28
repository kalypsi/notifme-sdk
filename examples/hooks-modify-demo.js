/* @flow */
import NotifmeSdk from '../src'

console.log('=== Hook Demo: Modifying request in beforeSend ===\n')

const notifmeSdk = new NotifmeSdk({
  useNotificationCatcher: true,
  hooks: {
    beforeSend: (request) => {
      console.log('📥 Original request:', request.email && request.email.subject)

      const modifiedRequest = {
        ...request,
        metadata: {
          ...request.metadata,
          sentAt: new Date().toISOString(),
          viaHooks: true
        },
        email: request.email ? {
          ...request.email,
          subject: `[MODIFIED] ${request.email.subject}`
        } : undefined
      }

      console.log('📥 Modified request:', modifiedRequest.email && modifiedRequest.email.subject)
      return modifiedRequest
    },
    afterSend: (result) => {
      console.log('📤 Result status:', result.status)

      return {
        ...result,
        info: {
          ...result.info,
          processedAt: new Date().toISOString()
        }
      }
    }
  }
})

const notificationRequest = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Original Subject',
    html: '<b>Hello!</b>'
  }
}

const run = async () => {
  await notifmeSdk.send(notificationRequest)
  console.log('\n✅ Done! Check the email subject was modified.')
}

run()
