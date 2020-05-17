const SoapErrorMapper = require('.')

class SoapErrorMapperLocator
{
  locate()
  {
    return new SoapErrorMapper()
  }
}

module.exports = SoapErrorMapperLocator
