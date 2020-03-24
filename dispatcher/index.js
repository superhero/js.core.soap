const NotImplementedError = require('./error/not-implemented')

class SoapDispatcher
{
  constructor(locator, view)
  {
    this.locator  = locator
    this.view     = view
  }

  dispatch()
  {
    const msg = '"dispatch" method is not implemented'
    throw new NotImplementedError(msg)
  }

  onError(error)
  {
    throw error
  }
}

module.exports = SoapDispatcher
