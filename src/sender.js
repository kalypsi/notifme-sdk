/* @flow */
import logger from './util/logger'
import ProviderLogger from './providers/logger'
import Registry from './util/registry'
// Types
import type { NotificationRequestType, NotificationStatusType, ChannelType, HooksType } from './index'
import type { ProvidersType } from './providers'
import type { StrategiesType } from './strategies/providers'

export interface SenderType {
  send(NotificationRequestType): Promise<NotificationStatusType>
}

export default class Sender implements SenderType {
  channels: string[]
  providers: ProvidersType
  strategies: StrategiesType
  hooks: ?HooksType
  senders: {[ChannelType]: (request: any) => Promise<{providerId: string, id: string}>}

  constructor (channels: string[], providers: ProvidersType, strategies: StrategiesType, hooks?: HooksType) {
    this.channels = channels
    this.providers = providers
    this.strategies = strategies
    this.hooks = hooks

    // note : we can do this memoization because we do not allow to add new provider
    this.senders = Object.keys(strategies).reduce((acc, channel: any) => {
      acc[channel] = this.providers[channel].length > 0
        ? strategies[channel](this.providers[channel])
        : async (request) => {
          logger.warn(`No provider registered for channel "${channel}". Using logger.`)
          const provider = Registry.getInstance(`${channel}-logger-default`,
            () => new ProviderLogger({}, channel))

          return {
            success: true,
            channel,
            providerId: provider.id,
            id: await provider.send(request)
          }
        }

      return acc
    }, {})
  }

  async send (request: NotificationRequestType): Promise<NotificationStatusType> {
    let modifiedRequest = request

    if (this.hooks && this.hooks.beforeSend) {
      modifiedRequest = await this.hooks.beforeSend(request)
    }

    const resultsByChannel = await this.sendOnEachChannel(modifiedRequest)

    const result = resultsByChannel.reduce((acc, { success, channel, providerId, ...rest }) => ({
      ...acc,
      channels: {
        ...(acc.channels || null),
        [channel]: { id: rest.id, providerId }
      },
      ...(!success
        ? { status: 'error', errors: { ...acc.errors || null, [channel]: rest.error.message } }
        : null
      )
    }), { status: 'success' })

    let finalResult = result

    if (this.hooks && this.hooks.afterSend) {
      finalResult = await this.hooks.afterSend(result)
    }

    return finalResult
  }

  async sendOnEachChannel (request: NotificationRequestType): Promise<Object[]> {
    return Promise.all(Object.keys(request)
      .filter((channel) => this.channels.includes(channel))
      .map(async (channel: any) => {
        const channelRequest = { ...request.metadata, ...request[channel] }

        let modifiedChannelRequest = channelRequest
        if (this.hooks && this.hooks.channels && this.hooks.channels[channel] && this.hooks.channels[channel].beforeSend) {
          modifiedChannelRequest = await this.hooks.channels[channel].beforeSend(channelRequest)
        }

        try {
          const sendResult = await this.senders[channel](modifiedChannelRequest)

          if (this.hooks && this.hooks.channels && this.hooks.channels[channel] && this.hooks.channels[channel].afterSend) {
            await this.hooks.channels[channel].afterSend(sendResult)
          }

          return {
            success: true,
            channel,
            ...sendResult
          }
        } catch (error) {
          if (this.hooks && this.hooks.channels && this.hooks.channels[channel] && this.hooks.channels[channel].onError) {
            await this.hooks.channels[channel].onError(error, channel, modifiedChannelRequest)
          } else if (this.hooks && this.hooks.onError) {
            await this.hooks.onError(error, channel, modifiedChannelRequest)
          }

          return { channel, success: false, error: error, providerId: error.providerId }
        }
      }))
  }
}
