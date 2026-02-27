/* @flow */
import EmailSmtpProvider from './email/smtp'
// Types
import type { ChannelType } from '../index'
import type { EmailRequestType } from '../models/notification-request'

export default class NotificationCatcherProvider {
  id: string
  provider: EmailSmtpProvider

  static getConfig (channels: ChannelType[]) {
    return channels.reduce((config, channel: any) => ({
      ...config,
      [channel]: {
        providers: [{ type: 'notificationcatcher' }],
        multiProviderStrategy: 'no-fallback'
      }
    }), {})
  }

  constructor (channel: ChannelType) {
    this.id = `${channel}-notificationcatcher-provider`

    if (process.env.NODE_ENV === 'production' && process.env.NOTIFME_ALLOW_CATCHER_IN_PROD !== 'true') {
      throw new Error(
        'Notification catcher is disabled in production. Set NOTIFME_ALLOW_CATCHER_IN_PROD=true to override.'
      )
    }

    const options = process.env.NOTIFME_CATCHER_OPTIONS || {
      host: '127.0.0.1',
      port: 1025,
      ignoreTLS: true
    }

    this.provider = new EmailSmtpProvider(options)
  }

  async sendToCatcher (request: EmailRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
