class SoapWsdlXmlBuilder
{
  constructor(coreString, schemaComposer)
  {
    this.coreString     = coreString
    this.schemaComposer = schemaComposer
  }

  build(config)
  {
    const schemas = {}

    for(const route in config.routes)
    {
      const
      item              = config.routes[route],
      input             = item.input.split('/').pop(),
      inputCamelCase    = this.coreString.composeCamelCase(input),
      inputMessageName  = this.coreString.composeFirstUpperCase(inputCamelCase)

      schemas[item.input] =
      {
        messageName : inputMessageName,
        schema      : this.schemaComposer.schemas[item.input]
      }

      const
      output            = item.output.split('/').pop(),
      outputCamelCase   = this.coreString.composeCamelCase(output),
      outputMessageName = this.coreString.composeFirstUpperCase(outputCamelCase)

      schemas[item.output] =
      {
        messageName : outputMessageName,
        schema      : this.schemaComposer.schemas[item.output]
      }
    }

    let wsdl = `
    <definitions
      name            = "${config.service}"
      targetNamespace = "${config.location}/${config.service}.wsdl"
      xmlns           = "http://schemas.xmlsoap.org/wsdl/"
      xmlns:soap      = "http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:tns       = "${config.location}/${config.service}.wsdl"
      xmlns:xsd       = "http://www.w3.org/2001/XMLSchema">`

    for(const key in schemas)
    {
      wsdl += `<message name="${schemas[key].messageName}">`

      for(const arg in schemas[key].schema)
      {
        wsdl += `<part name="${arg}" type="xsd:${schemas[key].schema[arg].type}"/>`
      }

      wsdl += `</message>`
    }

    wsdl += `<portType name="${config.service}_PortType">`

    for(const operation in config.routes)
    {
      wsdl += `
      <operation name="${operation}">
        <input  message="tns:${schemas[config.routes[operation].input].messageName}"/>
        <output message="tns:${schemas[config.routes[operation].output].messageName}"/>
      </operation>
      `
    }

    wsdl += `</portType>`
    wsdl +=
    `
    <binding name="${config.service}_Binding" type="tns:${config.service}_PortType">
      <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    `

    for(const operation in config.routes)
    {
      wsdl += `
      <operation name="${operation}">
        <soap:operation soapAction="${operation}"/>

        <input>
          <soap:body
            encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
            namespace     = "urn:examples:${config.service}"
            use           = "encoded"/>
        </input>

        <output>
          <soap:body
            encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
            namespace     = "urn:examples:${config.service}"
            use           = "encoded"/>
        </output>
      </operation>`
    }

    wsdl += `</binding>`

    wsdl += `
    <service name = "${config.service}_Service">
      <documentation>WSDL File for HelloService</documentation>

      <port binding="tns:${config.service}_Binding" name="${config.service}_Port">
         <soap:address location="${config.location}"/>
      </port>
    </service>`

    wsdl += `</definitions>`

    return wsdl
  }
}

module.exports = SoapWsdlXmlBuilder
