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
    const
    path      = this.locator.locate('core/path'),
    composer  = this.locator.locate('core/schema/composer')

    return new SoapWsdlRouterBuilder(this.locator, path, composer)
  }
}

module.exports = SoapWsdlRouterBuilderLocator
