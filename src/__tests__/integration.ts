import * as Raven from 'raven-js'
import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { HttpClient } from '@angular/common/http'

import { RavenInterceptorModule } from '../module'

jest.mock('raven-js')

describe('RavenInterceptor Integration', () => {
  let http: HttpClient
  let mock: HttpTestingController

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RavenInterceptorModule.forRoot({
          blacklistCodes: [400]
        })
      ]
    })

    http = testBed.get(HttpClient)
    mock = testBed.get(HttpTestingController)
    jest.resetAllMocks()
  })

  it('reports an error with proper context', (done) => {
    makeRequest('http://google.com/error', () => {
      expect(Raven.captureMessage).toHaveBeenCalledWith(
        'HTTP GET request to google.com failed.',
        {
          logger: 'ngx-raven-interceptor',
          tags: {
            'http-domain': 'google.com'
          },
          extra: {
            request: {
              method: 'GET',
              url: 'http://google.com/error'
            },
            response: {
              status: 401,
              message: 'Http failure response for http://google.com/error: 401 '
            }
          }
        }
      )
      done()
    })

    mockResponseError('http://google.com/error', { status: 401 })
  })

  it('reports an error if a domain is invalid', (done) => {
    makeRequest('/invalid-domain', () => {
      expect(Raven.captureMessage).toHaveBeenCalledTimes(1)
      expect(Raven.captureMessage).toHaveBeenCalledWith(
        'HTTP GET request to [invalid domain] failed.',
        {
          logger: 'ngx-raven-interceptor',
          tags: {
            'http-domain': '[invalid domain]'
          },
          extra: {
            request: {
              method: 'GET',
              url: '/invalid-domain'
            },
            response: {
              status: 500,
              message: 'Http failure response for /invalid-domain: 500 '
            }
          }
        }
      )
      done()
    })

    mockResponseError('/invalid-domain', { status: 500 })
  })

  it('filters blacklisted error code 400', (done) => {
    makeRequest('http://google.com/error', () => {
      expect(Raven.captureMessage).not.toBeCalled()
      done()
    })

    mockResponseError('http://google.com/error', { status: 400 })
  })

  function mockResponseError(uri: string, error: any): void {
    mock.expectOne(uri).error(new ErrorEvent('Dummy error'), error)
    mock.verify()
  }

  function makeRequest(uri: string, error: any): void {
    http.get(uri).subscribe(() => null, error)
  }
})
