class SoapWsdlRouterBuilder
{
  build(config)
  {
    const serviceRoutes = { [config.service]:{ [config.service + '_Port']:{} } }

    for(const service in config.routes)
    {
      serviceRoutes[config.service][config.service + '_Port'][service] = async () =>
      {
        try
        {
          const
          Dispatcher = require(config.routes[service].endpoint),
          dispatcher = new Dispatcher(locator, view)

          await dispatcher.dispatch()

          return dispatcher.view
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
