class SoapWsdlRouterBuilder
{
  build(routes)
  {
    const serviceRoutes = { [config.service]:{ [config.service + '_Port']:{} } }

    for(const service in config.routes)
    {
      serviceRoutes[config.service][config.service + '_Port'][service] = async () =>
      {
        try
        {
          const
          Endpoint = require(config.routes[service].endpoint),
          endpoint = new Endpoint(locator, view)

          await endpoint.dispatch()

          return endpoint.view
        }
        catch(error)
        {
          const fault =
          {
            Fault:
            {
              Code:
              {
                Value   : 'soap:Sender',
                Subcode :
                {
                  value : 'rpc:BadArguments'
                }
              },
              Reason:
              {
                Text: error.message
              }
            }
          }

          throw fault
        }
      }
    }
  }
}

module.exports = SoapWsdlRouterBuilder
