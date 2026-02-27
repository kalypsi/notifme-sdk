/* @flow */
import logger from '../../util/logger'
import { sanitizeErrorMessage } from '../../util/security'
// Types
import type { StrategyType } from './index'

const strategyProvidersNoFallback: StrategyType =
  ([provider]) => async (request) => {
    try {
      const id = await provider.send(request)
      return { providerId: provider.id, id }
    } catch (error) {
      logger.warn(`[${provider.id}] ${sanitizeErrorMessage(error)}`)
      error.providerId = provider.id
      throw error
    }
  }

export default strategyProvidersNoFallback
