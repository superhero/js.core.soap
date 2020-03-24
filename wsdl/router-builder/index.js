class SoapWsdlRouterBuilder
{
  constructor(locator, path)
  {
    this.locator  = locator
    this.path     = path
  }

  build(config)
  {
    const serviceRoutes = { [config.service + '_Service']:{ [config.service + '_Port']:{} } }

    for(const name in config.routes)
    {
      serviceRoutes[config.service + '_Service'][config.service + '_Port'][name] = async (input) =>
      {
        const fullPathname = `${this.path.main.dirname}/${config.routes[name].endpoint}`

        console.log('*****************', fullPathname)

        if(this.path.isResolvable(fullPathname))
        {
          try
          {
            const
            view        = {},
            Dispatcher  = require(fullPathname),
            dispatcher  = new Dispatcher(input, this.locator, view)

            await dispatcher.dispatch()

            return dispatcher.view.body
          }
          catch(error)
          {
            this.throwSoapFaultError(error.message)
          }
        }
        else
        {
          const msg = `dispatcher "${config.routes[name].endpoint}" can not be resolved`
          this.throwSoapFaultError(msg)
        }
      }
    }

    return serviceRoutes
  }

  throwSoapFaultError(message)
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
          Text: message
        }
      }
    }

    throw fault
  }
}

module.exports = SoapWsdlRouterBuilder
