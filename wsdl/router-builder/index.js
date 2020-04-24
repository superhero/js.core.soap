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
      serviceRoutes[config.service + '_Service'][config.service + '_Port'][name] = async (input, _, headers) =>
      {
        const
        route         = config.routes[name],
        composedInput = this.composeInput(route, input, headers),
        fullPathname  = `${this.path.main.dirname}/${route.endpoint}`

        if(this.path.isResolvable(fullPathname))
        {
          const view = await this.dispatch(fullPathname, composedInput)
          return view
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
      console.log('=========')
      console.log(error.code)
      console.log(error.message)
      console.log(error.stack)
      console.log('---------')
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

  composeInput(route, input, headers)
  {
    try
    {
      for(const part of [input, headers])
      {
        if(part === null)
        {
          continue
        }
        if(typeof part === 'object')
        {
          for(const key in part)
          {
            if(typeof part[key] === 'object'
            && '$value' in part[key])
            {
              part[key] = part[key]['$value']
            }
          }
        }
      }

      return this.composer.compose(route.input, [input, headers])
    }
    catch(error)
    {
      console.log('=========')
      console.log({ input, headers })
      console.log(error.code)
      console.log(error.message)
      console.log(error.stack)
      console.log('---------')

      this.throwSoapFaultError(error.message)
    }
  }
}

module.exports = SoapWsdlRouterBuilder
