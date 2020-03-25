class SoapWsdlRouterBuilder
{
  constructor(locator, path, composer)
  {
    this.locator  = locator
    this.path     = path
    this.composer = composer
  }

  build(config)
  {
    const serviceRoutes = { [config.service + '_Service']:{ [config.service + '_Port']:{} } }

    for(const name in config.routes)
    {
      serviceRoutes[config.service + '_Service'][config.service + '_Port'][name] = async (input) =>
      {
        const
        route         = config.routes[name],
        composedInput = this.composeInput(route, input),
        fullPathname  = `${this.path.main.dirname}/${route.endpoint}`

        if(this.path.isResolvable(fullPathname))
        {
          await this.dispatch(fullPathname, composedInput)
        }
        else
        {
          const msg = `dispatcher "${route.endpoint}" can not be resolved`
          this.throwSoapFaultError(msg)
        }
      }
    }

    return serviceRoutes
  }

  async dispatch(fullPathname, composedInput)
  {
    try
    {
      const
      view        = {},
      Dispatcher  = require(fullPathname),
      dispatcher  = new Dispatcher(composedInput, this.locator, view)

      await dispatcher.dispatch()

      return dispatcher.view
    }
    catch(error)
    {
      this.throwSoapFaultError(error.message)
    }
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

  composeInput(route, input)
  {
    try
    {
      return this.composer.compose(route.input, input)
    }
    catch(error)
    {
      this.throwSoapFaultError(error.message)
    }
  }
}

module.exports = SoapWsdlRouterBuilder
