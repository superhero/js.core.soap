const
soap      = require('soap'),
CoreSoap  = require('.')

class CoreSoapLocator
{
  constructor(locator)
  {
    this.locator = locator
  }

  locate()
  {
    const
    wsdlXmlBuilder    = this.locator.locate('soap/wsdl/xml-builder'),
    wsdlRouterBuilder = this.locator.locate('soap/wsdl/router-builder')

    return new CoreSoap(soap, wsdlXmlBuilder, wsdlRouterBuilder)
  }
}

module.exports = CoreSoapLocator
