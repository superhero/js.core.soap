class NotImplemented extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_SOAP_DISPATCHER'
  }
}

module.exports = NotImplemented
