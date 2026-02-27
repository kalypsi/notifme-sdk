/* @flow */
import crypto from 'crypto'
import logger from '../util/logger'
import { redactSensitive } from '../util/security'
// Types
import type { ChannelType } from '../index'
import type { RequestType } from '../models/notification-request'

export default class LoggerProvider {
  id: string
  channel: ChannelType

  constructor (config: Object, channel: ChannelType) {
    this.id = `${channel}-logger-provider`
    this.channel = channel
  }

  async send (request: RequestType): Promise<string> {
    logger.info(`[${this.channel.toUpperCase()}] Sent by "${this.id}":`)
    logger.info(redactSensitive(request))
    return `id-${crypto.randomBytes(16).toString('hex')}`
  }
}
