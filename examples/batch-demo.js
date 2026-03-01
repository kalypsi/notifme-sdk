/* @flow */
import NotifmeSdk from '../src'

console.log('=== Batch Send Demo ===\n')

const sdk = new NotifmeSdk({
  useNotificationCatcher: true
})

const requests = [
  {
    email: {
      from: 'sender1@example.com',
      to: 'user1@example.com',
      subject: 'Email 1',
      text: 'Hello user 1!'
    }
  },
  {
    email: {
      from: 'sender2@example.com',
      to: 'user2@example.com',
      subject: 'Email 2',
      text: 'Hello user 2!'
    }
  },
  {
    sms: {
      from: '+15000000000',
      to: '+15000000001',
      text: 'Hello SMS!'
    }
  }
]

const run = async () => {
  console.log('Sending batch of', requests.length, 'notifications...\n')

  const results = await sdk.sendBatch(requests)

  console.log('\nResults:')
  results.forEach((result, index) => {
    console.log(`Request ${index + 1}:`, result.status)
  })

  console.log('\n✅ Batch send complete!')
}

run()
