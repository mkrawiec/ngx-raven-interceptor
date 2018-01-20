import { NgModule, ModuleWithProviders } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

import './rx-operators'
import { RavenInterceptor } from './interceptor'
import { ErrorFilter } from './error-filter'
import { RAVEN_INTERCEPTOR_CONFIG } from './config'

export interface RavenInterceptorConfig {
  blacklistCodes?: number[]
  whitelistCodes?: number[]
}

@NgModule({})
export class RavenInterceptorModule {
  public static forRoot(
    config: RavenInterceptorConfig = {}
  ): ModuleWithProviders {
    return {
      ngModule: RavenInterceptorModule,
      providers: [
        {
          provide: RAVEN_INTERCEPTOR_CONFIG,
          useValue: config
        },
        ErrorFilter,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RavenInterceptor,
          multi: true
        }
      ]
    }
  }
}
