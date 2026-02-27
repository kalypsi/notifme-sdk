/* @flow */
import NotifmeSdk from './src'

const notifmeSdk = new NotifmeSdk({
  useNotificationCatcher: true
})

const run = async () => {
  const result = await notifmeSdk.send({
    sms: {
      from: '+15000000000',
      to: '+15000000001',
      text: 'Hello World!'
    },
    email: {
      from: 'jay@test.com',
      to: 'careers@kalypsi.com',
      subject: 'Hello World!',
      text: 'Hello World! This is a test email.',
      html: '<h1>Hello World!</h1><p>This is a test email.</p>'
    }
  })

  console.log(result)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
