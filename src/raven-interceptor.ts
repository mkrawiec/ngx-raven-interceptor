import * as Raven from 'raven-js'
import { Observable } from 'rxjs/Observable'
import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http'

import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/throw'

@Injectable()
export class RavenInterceptor implements HttpInterceptor {
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).catch((error) => {
      if (error instanceof HttpErrorResponse) {
        this.handleErrorResponse(req, error)
      }

      return Observable.throw(error)
    })
  }

  private handleErrorResponse(req: HttpRequest<any>, res: HttpErrorResponse): void {
    const context = {
      request: {
        method: req.method,
        url: req.url
      },
      response: {
        status: res.status,
        message: res.message,
        error: res.error
      }
    }

    this.reportError(req.url, context)
  }

  private reportError(url: string, extra: any): void {
    const domain = this.getDomainName(url)

    Raven.captureMessage(`HTTP ${extra.request.method} request to ${domain} failed.`, {
      extra,
      logger: 'ngx-raven-interceptor',
      tags: {
        'http-domain': domain
      }
    })
  }

  private getDomainName(url: string): string {
    try {
      return new URL(url).host
    } catch (e) {
      return '[invalid domain]'
    }
  }
}
