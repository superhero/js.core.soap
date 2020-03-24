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
    const path = this.locator.locate('core/path')
    return new SoapWsdlRouterBuilder(this.locator, path)
  }
}

module.exports = SoapWsdlRouterBuilderLocator
