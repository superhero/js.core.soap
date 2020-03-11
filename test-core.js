const
CoreFactory = require('superhero/core/factory'),
coreFactory = new CoreFactory

core = coreFactory.create()

core.add('soap', __dirname)

core.load()

core.locate('core/bootstrap').bootstrap().then(() =>
{
   const result1 = core.locate('soap/wsdl/xml-builder').build(
   {
      location  : 'http://localhost:8000/wsdl',
      service   : 'HelloService',
      routes    :
      {
         'sayHello':
         {
            endpoint  : 'api/endpoint/create-calculation',
            input     : 'event/requested-to-say-hello',
            output    : 'event/requested-to-say-hello-response'
         },
         'sayGoodbye':
         {
            endpoint  : 'api/endpoint/create-calculation',
            input     : 'event/requested-to-say-goodbye',
            output    : 'event/requested-to-say-goodbye-response'
         }
      }
   })

   console.log(result1)

  //

   const result2 = core.locate('soap/wsdl/route-builder').build(
   {
      location  : 'http://localhost:8000/wsdl',
      service   : 'HelloService',
      routes    :
      {
         'sayHello':
         {
            endpoint  : 'api/endpoint/create-calculation',
            input     : 'event/requested-to-say-hello',
            output    : 'event/requested-to-say-hello-response'
         },
         'sayGoodbye':
         {
            endpoint  : 'api/endpoint/create-calculation',
            input     : 'event/requested-to-say-goodbye',
            output    : 'event/requested-to-say-goodbye-response'
         }
      }
   })

   console.log(result2)
})
