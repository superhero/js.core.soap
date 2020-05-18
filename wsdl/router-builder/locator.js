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
    configuration       = this.locator.locate('core/configuration'),
    path                = this.locator.locate('core/path'),
    composer            = this.locator.locate('core/schema/composer'),
    errorMapperLocation = configuration.find('core/soap/error-mapper'),
    errorMapper         = this.locator.locate(errorMapperLocation)

    return new SoapWsdlRouterBuilder(this.locator, path, composer, errorMapper)
  }
}

module.exports = SoapWsdlRouterBuilderLocator
