/**
 * @memberof Api
 */
class SoapErrorMapper
{
  /**
   * @param {Error} error
   */
  async mapFromErrorToSoapFault(error)
  {
    const
    subcode = error.code,
    reason  = error.message,
    fault   =
    {
      Fault:
      {
        Code:
        {
          Value   : 'soap:Sender',
          Subcode :
          {
            value : 'rpc:' + subcode
          }
        },
        Reason:
        {
          Text: reason
        }
      }
    }

    return fault
  }
}

module.exports = SoapErrorMapper
