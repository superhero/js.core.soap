class SoapWsdlRouterBuilder
{
  build(config)
  {
    const serviceRoutes = { [config.service + '_Service']:{ [config.service + '_Port']:{} } }

    for(const service in config.routes)
    {
      serviceRoutes[config.service + '_Service'][config.service + '_Port'][service] = async (input) =>
      {
        try
        {
          const
          Dispatcher = require(config.routes[service].endpoint),
          dispatcher = new Dispatcher(input, locator, view)

          await dispatcher.dispatch()

          return dispatcher.view.body
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
