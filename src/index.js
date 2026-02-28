/* @flow */
/* global $Keys */
import NotificationCatcherProvider from './providers/notificationCatcherProvider'
import Sender from './sender'
import dedupe from './util/dedupe'
import logger from './util/logger'
import providerFactory from './providers'
import strategyProvidersFactory from './strategies/providers'
// Types
import type { EmailRequestType, PushRequestType, SmsRequestType, VoiceRequestType, WebpushRequestType, SlackRequestType, WhatsappRequestType } from './models/notification-request'
import type { EmailProviderType } from './models/provider-email'
import type { PushProviderType } from './models/provider-push'
import type { SmsProviderType } from './models/provider-sms'
import type { VoiceProviderType } from './models/provider-voice'
import type { WebpushProviderType } from './models/provider-webpush'
import type { SlackProviderType } from './models/provider-slack'
import type { WhatsappProviderType } from './models/provider-whatsapp'
import type SenderType from './sender'

export const CHANNELS = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  voice: 'voice',
  webpush: 'webpush',
  slack: 'slack',
  whatsapp: 'whatsapp'
}
export type ChannelType = $Keys<typeof CHANNELS>

export type NotificationRequestType = {
  metadata?: {
    id?: string,
    userId?: string
  },
  email?: EmailRequestType,
  push?: PushRequestType,
  sms?: SmsRequestType,
  voice?: VoiceRequestType,
  webpush?: WebpushRequestType,
  slack?: SlackRequestType,
  whatsapp?: WhatsappRequestType
  // TODO?: other channels (messenger, skype, telegram, kik, spark...)
}

export type NotificationStatusType = {
  status: 'success' | 'error',
  channels?: {[channel: ChannelType]: {
    id: string,
    providerId: ?string
  }},
  info?: ?Object,
  errors?: {[channel: ChannelType]: Error}
}

export type BeforeSendHook = (request: NotificationRequestType) => NotificationRequestType | Promise<NotificationRequestType>

export type AfterSendHook = (result: NotificationStatusType) => NotificationStatusType | Promise<NotificationStatusType>

export type BeforeSendChannelHook = (request: mixed) => mixed | Promise<mixed>

export type AfterSendChannelHook = (result: mixed) => mixed | Promise<mixed>

export type ErrorHook = (error: Error, channel: ChannelType, request: mixed) => mixed | Promise<mixed>

export type ChannelHooksType = {|
  beforeSend?: BeforeSendChannelHook,
  afterSend?: AfterSendChannelHook,
  onError?: ErrorHook
|}

export type HooksType = {|
  beforeSend?: BeforeSendHook,
  afterSend?: AfterSendHook,
  onError?: ErrorHook,
  channels?: {
    email?: ChannelHooksType,
    sms?: ChannelHooksType,
    push?: ChannelHooksType,
    webpush?: ChannelHooksType,
    voice?: ChannelHooksType,
    slack?: ChannelHooksType,
    whatsapp?: ChannelHooksType
  }
|}

export type ProviderStrategyType = 'no-fallback' | 'fallback' | 'roundrobin' // Defaults to fallback

export type NotifmePlugin = {
  id: string,
  channel: ChannelType,
  providers: Array<Object>,
  strategy?: ProviderStrategyType
}

export type NotifmePluginCreator = (options: Object) => NotifmePlugin

export function emailPlugin (config: {|
  providers: EmailProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'email-plugin',
    channel: 'email',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export function smsPlugin (config: {|
  providers: SmsProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'sms-plugin',
    channel: 'sms',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export function pushPlugin (config: {|
  providers: PushProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'push-plugin',
    channel: 'push',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export function webpushPlugin (config: {|
  providers: WebpushProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'webpush-plugin',
    channel: 'webpush',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export function voicePlugin (config: {|
  providers: VoiceProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'voice-plugin',
    channel: 'voice',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export function slackPlugin (config: {|
  providers: SlackProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'slack-plugin',
    channel: 'slack',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export function whatsappPlugin (config: {|
  providers: WhatsappProviderType[],
  multiProviderStrategy?: ProviderStrategyType
|}): NotifmePlugin {
  return {
    id: 'whatsapp-plugin',
    channel: 'whatsapp',
    providers: config.providers,
    strategy: config.multiProviderStrategy
  }
}

export type OptionsType = {|
  channels?: {
    email?: {
      providers: EmailProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    push?: {
      providers: PushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    sms?: {
      providers: SmsProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    voice?: {
      providers: VoiceProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    webpush?: {
      providers: WebpushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    slack?: {
      providers: SlackProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    whatsapp?: {
      providers: WhatsappProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    }
  },
  plugins?: NotifmePlugin[],
  hooks?: HooksType,
  rateLimit?: {
    global?: {
      max: number,
      window: number // in seconds
    },
    channels?: {
      email?: { max: number, window: number },
      sms?: { max: number, window: number },
      push?: { max: number, window: number },
      webpush?: { max: number, window: number },
      voice?: { max: number, window: number },
      slack?: { max: number, window: number },
      whatsapp?: { max: number, window: number }
    }
  },
  useNotificationCatcher?: boolean // if true channels are ignored
|}

export default class NotifmeSdk {
  sender: SenderType
  logger: typeof logger = logger

  constructor (options: OptionsType) {
    const mergedOptions = this.mergeWithDefaultConfig(options)
    const channelsFromPlugins = this.convertPluginsToChannels(options.plugins)
    const combinedChannels = { ...mergedOptions.channels, ...channelsFromPlugins }
    const providers = providerFactory(combinedChannels)
    const strategies = strategyProvidersFactory(combinedChannels)

    const rateLimitConfig = this.buildRateLimitConfig(options.rateLimit)

    this.sender = new Sender(
      dedupe([...Object.keys(CHANNELS), ...Object.keys(providers)]),
      providers,
      strategies,
      mergedOptions.hooks,
      rateLimitConfig
    )
  }

  buildRateLimitConfig (rateLimit: ?Object): ?Object {
    if (!rateLimit) return null
    const config = {}
    if (rateLimit.global) {
      config.global = rateLimit.global
    }
    if (rateLimit.channels) {
      for (const channel of Object.keys(CHANNELS)) {
        if (rateLimit.channels[channel]) {
          config[channel] = rateLimit.channels[channel]
        }
      }
    }
    return Object.keys(config).length > 0 ? config : null
  }

  convertPluginsToChannels (plugins: ?NotifmePlugin[]): ?Object {
    if (!plugins || plugins.length === 0) {
      return null
    }
    return plugins.reduce((acc, plugin) => {
      acc[plugin.channel] = {
        providers: plugin.providers,
        multiProviderStrategy: plugin.strategy || 'fallback'
      }
      return acc
    }, {})
  }

  mergeWithDefaultConfig ({ channels, ...rest }: OptionsType) {
    return {
      useNotificationCatcher: false,
      ...rest,
      channels: rest.useNotificationCatcher
        ? NotificationCatcherProvider.getConfig(Object.keys(CHANNELS))
        : {
          ...channels,
          email: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.email : null)
          },
          push: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.push : null)
          },
          sms: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.sms : null)
          },
          voice: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.voice : null)
          },
          webpush: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.webpush : null)
          },
          slack: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.slack : null)
          },
          whatsapp: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.whatsapp : null)
          }
        }
    }
  }

  send (request: NotificationRequestType): Promise<NotificationStatusType> {
    return this.sender.send(request)
  }
}
