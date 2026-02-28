/* @flow */
import NotifmeSdk, { emailPlugin, smsPlugin, pushPlugin } from '../src'

console.log('=== Plugin System Demo ===\n')

// Old way (still works)
const sdkOld = new NotifmeSdk({
  channels: {
    email: {
      providers: [{ type: 'sendgrid', apiKey: 'old-way-key' }]
    }
  }
})

// New way - using plugins
const sdkNew = new NotifmeSdk({
  plugins: [
    // $FlowIgnore - demo
    emailPlugin({
      providers: [{ type: 'sendgrid', apiKey: 'new-way-key' }],
      multiProviderStrategy: 'roundrobin'
    }),
    // $FlowIgnore - demo
    smsPlugin({
      providers: [{ type: 'twilio', accountSid: 'SID', authToken: 'TOKEN' }]
    }),
    // $FlowIgnore - demo
    pushPlugin({
      providers: [{ type: 'fcm', id: 'sender-id' }],
      multiProviderStrategy: 'fallback'
    })
  ],
  hooks: {
    beforeSend: (request) => {
      console.log('📥 Plugin demo - beforeSend:', request)
      return request
    }
  }
})

console.log('✅ Both SDKs created successfully!')
console.log('Old way (channels):', sdkOld.sender)
console.log('New way (plugins):', sdkNew.sender)
console.log('\nBoth methods work identically - plugins are just a cleaner API!')
