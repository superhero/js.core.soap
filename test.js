var myService =
{
   Hello_Service:
   {
      Hello_Port:
      {
         sayHello: async (args) =>
         {
            return {
               greeting : 'Hello, ' + args.name
            }
         }
      }
   }
};

// var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

//http server example
var server = require('http').createServer(function(request,response) {
  response.end('404: Not Found: ' + request.url);
});

server.listen(8000);

const soap = require('soap')

const xml = `
<definitions name = "HelloService"
   targetNamespace = "http://localhost:8000/wsdl/HelloService.wsdl"
   xmlns = "http://schemas.xmlsoap.org/wsdl/"
   xmlns:soap = "http://schemas.xmlsoap.org/wsdl/soap/"
   xmlns:tns = "http://localhost:8000/wsdl/HelloService.wsdl"
   xmlns:xsd = "http://www.w3.org/2001/XMLSchema">

   <message name = "SayHelloRequest">
      <part name = "name" type = "xsd:string"/>
   </message>

   <message name = "SayHelloResponse">
      <part name = "greeting" type = "xsd:string"/>
   </message>

   <portType name = "Hello_PortType">
      <operation name = "sayHello">
         <input message = "tns:SayHelloRequest"/>
         <output message = "tns:SayHelloResponse"/>
      </operation>
   </portType>

   <binding name = "Hello_Binding" type = "tns:Hello_PortType">
      <soap:binding style = "rpc"
         transport = "http://schemas.xmlsoap.org/soap/http"/>
      <operation name = "sayHello">
         <soap:operation soapAction = "sayHello"/>
         <input>
            <soap:body
               encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
               namespace = "urn:examples:helloservice"
               use = "encoded"/>
         </input>

         <output>
            <soap:body
               encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
               namespace = "urn:examples:helloservice"
               use = "encoded"/>
         </output>
      </operation>
   </binding>

   <service name = "Hello_Service">
      <documentation>WSDL File for HelloService</documentation>
      <port binding = "tns:Hello_Binding" name = "Hello_Port">
         <soap:address
            location = "http://localhost:8000/wsdl/" />
      </port>
   </service>
</definitions>`

const xml2 = `
<definitions
      name            = "HelloService"
      targetNamespace = "http://localhost:9001/wsdl/HelloService.wsdl"
      xmlns           = "http://schemas.xmlsoap.org/wsdl/"
	xmlns:soap      = "http://schemas.xmlsoap.org/wsdl/soap/"
	xmlns:tns       = "http://localhost:9001/wsdl/HelloService.wsdl"
	xmlns:xsd       = "http://www.w3.org/2001/XMLSchema">
	<message name="RequestedToSayHello"></message>
	<message name="RequestedToSayHelloResponse"></message>
	<message name="RequestedToSayGoodbye"></message>
	<message name="RequestedToSayGoodbyeResponse"></message>
	<portType name="HelloService_PortType">
		<operation name="sayHello">
			<input  message="tns:RequestedToSayHello"/>
			<output message="tns:RequestedToSayHelloResponse"/>
		</operation>
		<operation name="sayGoodbye">
			<input  message="tns:RequestedToSayGoodbye"/>
			<output message="tns:RequestedToSayGoodbyeResponse"/>
		</operation>
	</portType>
	<binding name="HelloService_Binding" type="tns:HelloService_PortType">
		<soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
		<operation name="sayHello">
			<soap:operation soapAction="sayHello"/>
			<input>
				<soap:body
            encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
            namespace     = "urn:examples:HelloService"
            use           = "encoded"/>
			</input>
			<output>
				<soap:body
            encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
            namespace     = "urn:examples:HelloService"
            use           = "encoded"/>
			</output>
		</operation>
		<operation name="sayGoodbye">
			<soap:operation soapAction="sayGoodbye"/>
			<input>
				<soap:body
            encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
            namespace     = "urn:examples:HelloService"
            use           = "encoded"/>
			</input>
			<output>
				<soap:body
            encodingStyle = "http://schemas.xmlsoap.org/soap/encoding/"
            namespace     = "urn:examples:HelloService"
            use           = "encoded"/>
			</output>
		</operation>
	</binding>
	<service name = "HelloService">
		<documentation>WSDL File for HelloService</documentation>
		<port binding="tns:HelloService" name="HelloService_Port">
			<soap:address location="http://localhost:9001/wsdl"/>
		</port>
	</service>
</definitions>`

soap.listen(server, '/wsdl', myService, xml, function()
{
   console.log('server initialized');

   var url = 'http://localhost:8000/wsdl?wsdl';
   var args = { name:'World' };

   soap.createClient(url, async function(err, client)
   {
      if(err)
         console.log(err)

      else
      {
         const result = await client.sayHello(args, function(err, result)
         {
            if(err)
               console.log(err)

            else
            {
               console.log('result1:');
               console.log(result);
            }
         });
      }
   });
});
