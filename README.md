# ngx-raven-interceptor
Angular 4.3.0+ Http Error Interceptor for Sentry.
Once included, it will log every failed HTTP request from `HttpClient` to Sentry.

### Installation

`npm install --save ngx-raven-interceptor`

Make sure that raven is [installed and configured properly](https://docs.sentry.io/clients/javascript/integrations/angular/) as well as hooked up as `ErrorHandler` in your app.

Include `RavenInterceptorModule` in root `@NgModule` of your app.

```typescript
import { BrowserModule } from '@angular/platform-browser'
import { NgModule, ErrorHandler } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component'
import { RavenErrorHandler } from './error-handler'
import { RavenInterceptorModule } from 'ngx-raven-interceptor'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RavenInterceptorModule.forRoot() // HERE
  ],
  providers: [
    { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Configuration

You can provide config object to the `forRoot()` function to whitelist or blacklist specific error codes from sending Sentry events

For example to log only 500, 502, 503 error codes:

    RavenInterceptorModule.forRoot({ whitelistCodes: [500, 501, 503] })

Or you can invert the logic and skip only certain error codes:

    RavenInterceptorModule.forRoot({ blacklistCodes: [400] })
