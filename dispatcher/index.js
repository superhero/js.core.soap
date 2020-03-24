const NotImplementedError = require('./error/not-implemented')

class SoapDispatcher
{
  constructor(input, locator, view)
  {
    this.input    = input
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
