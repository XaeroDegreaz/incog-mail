import {APIGatewayProxyHandler} from "aws-lambda";
import {ApiGatewayManagementApi, DynamoDB} from "aws-sdk";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!
export const handler: APIGatewayProxyHandler = async ( event ) => {
  const connectionId = event.requestContext.connectionId!
  const dynamo = new DynamoDB();
  const item = await dynamo.getItem( {
    TableName: CONNECTIONS_TABLE,
    Key: {
      connectionId: {S: connectionId}
    }
  } ).promise();

  if ( !item.Item )
  {
    console.error( `No email found for connectionId:${connectionId}` )
    return {statusCode: 500, body: undefined!}
  }
  const management = new ApiGatewayManagementApi( {
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`
  } );
  await management.postToConnection( {
    ConnectionId: connectionId,
    Data: JSON.stringify( {emailAddress: item.Item.emailAddress.S} )
  } ).promise();
  return {statusCode: 200, body: 'Email Created.'}
}
