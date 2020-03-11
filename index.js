class Soap
{
  constructor(soap, wsdlXmlBuilder, wsdlRouterBuilder)
  {
    this.soap               = soap
    this.wsdlXmlBuilder     = wsdlXmlBuilder
    this.wsdlRouterBuilder  = wsdlRouterBuilder
  }

  listen(server, routes)
  {
    const
    wsdlXml     = this.wsdlXmlBuilder.build(routes),
    wsdlRouter  = this.wsdlRouterBuilder.build(routes)

    this.soap.listen(server, '/wsdl', wsdlRouter, wsdlXml, this.onListening.bind(this))
  }

  onListening()
  {
    console.log('soap server is listening')
  }

  close()
  {
    // TODO: access the server passed along the listen method and close the connection
    throw new Error('not implemented')
  }
}

module.exports = Soap
