import {ReactStaticSite, StackContext, use} from "@serverless-stack/resources";
import {BackendStack} from "./BackendStack";

export function FrontendStack( {stack, app}: StackContext )
{
  const {webSocket, getComputedDomain} = use( BackendStack );
  const site = new ReactStaticSite( stack, 'ReactSite', {
    path: 'frontend',
    customDomain: {
      hostedZone: process.env.DOMAIN,
      domainName: getComputedDomain()
    },
    environment: {
      REACT_APP_WEBSOCKET_ENDPOINT: webSocket.url,
      REACT_APP_DOMAIN: process.env.DOMAIN!
    }
  } );

  stack.addOutputs( {
    ReactSiteUrl: site.url
  } )
}
