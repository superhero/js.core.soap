const
SoapWsdlXmlBuilder  = require('.')

class SoapWsdlXmlBuilderLocator
{
  constructor(locator)
  {
    this.locator = locator
  }

  locate()
  {
    const
    coreString      = this.locator.locate('core/string'),
    schemaComposer  = this.locator.locate('core/schema/composer')

    return new SoapWsdlXmlBuilder(coreString, schemaComposer)
  }
}

module.exports = SoapWsdlXmlBuilderLocator
