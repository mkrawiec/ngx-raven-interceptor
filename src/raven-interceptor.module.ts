import { NgModule } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { RavenInterceptor } from './raven-interceptor'

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RavenInterceptor,
      multi: true
    }
  ]
})
export class RavenInterceptorModule { }
