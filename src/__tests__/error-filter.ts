import { ErrorFilter } from '../error-filter'

describe('ErrorFilter', () => {
  it('throws error if both "whitelistCodes" and "blacklistCodes" are provided', () => {
    const config = {
      blacklistCodes: [500],
      whitelistCodes: [200]
    }

    expect(() => new ErrorFilter(config)).toThrowError(
      "'whitelistCode' and 'blacklistCodes' can be provided but not both."
    )
  })

  describe('#filter()', () => {
    it('returns true only if code is in the whitelist', () => {
      const config = { whitelistCodes: [500, 501, 502, 503] }
      const service = new ErrorFilter(config)

      expect(service.filter(500)).toBeTruthy()
      expect(service.filter(200)).toBeFalsy()
    })

    it('returns true if code is not on the blacklist', () => {
      const config = { blacklistCodes: [400, 200, 301] }
      const service = new ErrorFilter(config)

      expect(service.filter(500)).toBeTruthy()
      expect(service.filter(400)).toBeFalsy()
    })

    it('returns true if config is empty object', () => {
      const config = {}
      const service = new ErrorFilter(config)

      expect(service.filter(200)).toBeTruthy()
      expect(service.filter(600)).toBeTruthy()
    })
  })
})
