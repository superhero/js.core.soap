module.exports =
{
  core:
  {
    locator:
    {
      'soap'              : __dirname,
      'soap/error-mapper' : __dirname + '/error-mapper',
      'soap/wsdl/*'       : __dirname + '/wsdl/*'
    }
  },
  soap:
  {
    'error-mapper' : 'soap/error-mapper'
  }
}
