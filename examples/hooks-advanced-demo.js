/* @flow */
import NotifmeSdk from '../src'

console.log('=== Advanced Hooks Demo: Per-channel & onError ===\n')

const notifmeSdk = new NotifmeSdk({
  useNotificationCatcher: true,
  hooks: {
    beforeSend: (request) => {
      console.log('📥 Global beforeSend')
      return request
    },
    afterSend: (result) => {
      console.log('📤 Global afterSend - status:', result.status)
      return result
    },
    onError: (error, channel, request) => {
      console.log(`❌ Global onError - Channel: ${channel}, Error:`, error.message)
    },
    channels: {
      email: {
        beforeSend: (emailRequest) => {
          console.log('📧 Email beforeSend - adding custom header')
          return { ...emailRequest, headers: { 'X-Custom': 'email-hook' } }
        },
        afterSend: (result) => {
          console.log('📧 Email afterSend - result:', result)
        },
        onError: (error, channel, request) => {
          console.log('📧 Email-specific onError:', error.message)
        }
      },
      sms: {
        beforeSend: (smsRequest) => {
          console.log('📱 SMS beforeSend - validating phone')
          return smsRequest
        }
      }
    }
  }
})

const notificationRequest = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Test Subject',
    html: '<b>Hello!</b>'
  },
  sms: {
    from: '+15000000000',
    to: '+15000000001',
    text: 'Hello!'
  }
}

const run = async () => {
  console.log('Sending notification with advanced hooks...\n')
  await notifmeSdk.send(notificationRequest)
  console.log('\n✅ Done! Check the output above.')
}

run()
