/* @flow */
import NotifmeSdk from '../src'

const notifmeSdk = new NotifmeSdk({
  useNotificationCatcher: true,
  hooks: {
    beforeSend: (request) => {
      console.log('📥 Hook - beforeSend:', JSON.stringify(request, null, 2))
      return request
    },
    afterSend: (result) => {
      console.log('📤 Hook - afterSend:', JSON.stringify(result, null, 2))
      return result
    }
  }
})

const notificationRequest = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  },
  sms: {
    from: '+15000000000',
    to: '+15000000001',
    text: 'Hello John! How are you?'
  }
}

const run = async () => {
  const result = await notifmeSdk.send(notificationRequest)
  console.log('\n✅ Final result:', JSON.stringify(result, null, 2))
}

run()
