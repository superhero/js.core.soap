const HttpError = require('.')

class NotImplemented extends HttpError
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_SOAP_DISPATCHER'
  }
}

module.exports = NotImplemented