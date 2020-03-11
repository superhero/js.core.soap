const
SoapWsdlRouterBuilder = require('.')

class SoapWsdlRouterBuilderLocator
{
  constructor(locator)
  {
    this.locator = locator
  }

  locate()
  {
    return new SoapWsdlRouterBuilder()
  }
}

module.exports = SoapWsdlRouterBuilderLocator
