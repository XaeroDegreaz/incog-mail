import {APIGatewayProxyHandler} from "aws-lambda";
import {ApiGatewayManagementApi} from "aws-sdk";

export const handler: APIGatewayProxyHandler = async ( event ) => {
  const connectionId = event.requestContext.connectionId!
  const management = new ApiGatewayManagementApi( {
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`
  } );
  await management.postToConnection( {
    ConnectionId: connectionId,
    Data: JSON.stringify( {emailAddress: 'asdasd'} )
  } ).promise();
  return {statusCode: 200, body: 'Connected to websocket.'}
}
