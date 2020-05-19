/**
 * @memberof Api
 */
class SoapErrorMapper
{
  /**
   * @param {Error} error
   */
  toSoapFault(error)
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
