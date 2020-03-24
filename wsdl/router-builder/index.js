class SoapWsdlRouterBuilder
{
  constructor(locator)
  {
    this.locator = locator
  }

  build(config)
  {
    const serviceRoutes = { [config.service + '_Service']:{ [config.service + '_Port']:{} } }

    for(const name in config.routes)
    {
      serviceRoutes[config.service + '_Service'][config.service + '_Port'][name] = async (input) =>
      {
        console.log(__filename)

        try
        {
          const
          view        = {},
          Dispatcher  = require(config.routes[name].endpoint),
          dispatcher  = new Dispatcher(input, this.locator, view)

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

    return serviceRoutes
  }
}

module.exports = SoapWsdlRouterBuilder
