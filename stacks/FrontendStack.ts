import {ReactStaticSite, StackContext, use} from "@serverless-stack/resources";
import {MyStack} from "./MyStack";

export function FrontendStack( {stack, app}: StackContext )
{
  const {webSocket} = use( MyStack );
  const site = new ReactStaticSite( stack, 'ReactSite', {
    path: 'frontend',
    environment: {
      REACT_APP_WEBSOCKET_ENDPOINT: webSocket.url
    }
  } );

  stack.addOutputs( {
    ReactSiteUrl: site.url
  } )
}
