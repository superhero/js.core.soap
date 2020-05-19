class SoapWsdlRouterBuilder
{
  constructor(locator, path, composer, errorMapper)
  {
    this.locator      = locator
    this.path         = path
    this.composer     = composer
    this.errorMapper  = errorMapper
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
          const
          view        = await this.dispatch(fullPathname, composedInput),
          mappedView  = this.mapNullValues(view)

          return mappedView
        }
        else
        {
          const 
          msg   = `dispatcher "${route.endpoint}" can not be resolved`,
          error = new Error(msg)

          error.code = 'E_SOAP_ENDPOINT_UNRESOLVABLE'

          throw this.errorMapper.toSoapFault(error)
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
      throw this.errorMapper.toSoapFault(error)
    }
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
        if(part !== null
        && typeof part === 'object')
        {
          for(const key in part)
          {
            if(part[key] !== null
            && typeof part[key] === 'object'
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
      error.code = 'E_SOAP_COMPOSE_INPUT'
      throw this.errorMapper.toSoapFault(error)
    }
  }

  mapNullValues(viewModel)
  {
    const output = {}

    for (const key in viewModel)
    {
      if(viewModel[key] === null
      || viewModel[key] === undefined)
      {
        output[key] = { attributes: { 'xsi:nil': 'true' } }
      }
      else
      {
        output[key] = viewModel[key]
      }
    }

    return output
  }
}

module.exports = SoapWsdlRouterBuilder
