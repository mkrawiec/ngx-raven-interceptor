import { Injectable, Inject } from '@angular/core'

import { RavenInterceptorConfig } from './module'
import { RAVEN_INTERCEPTOR_CONFIG } from './config'

@Injectable()
export class ErrorFilter {
  constructor(
    @Inject(RAVEN_INTERCEPTOR_CONFIG) private config: RavenInterceptorConfig
  ) {
    if (config.whitelistCodes != null && config.blacklistCodes != null) {
      throw new Error(
        "'whitelistCode' and 'blacklistCodes' can be provided but not both."
      )
    }
  }

  public filter(code: number): boolean {
    if (this.config.blacklistCodes != null) {
      return !this.config.blacklistCodes.includes(code)
    } else if (this.config.whitelistCodes != null) {
      return this.config.whitelistCodes.includes(code)
    } else {
      return true
    }
  }
}
