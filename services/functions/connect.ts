import {APIGatewayProxyHandler} from "aws-lambda";
import {ApiGatewayManagementApi, DynamoDB} from "aws-sdk";
import {v4} from 'uuid';

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!
export const handler: APIGatewayProxyHandler = async ( event ) => {
  const connectionId = event.requestContext.connectionId!
  const emailAddress = v4();
  const dynamo = new DynamoDB();
  await dynamo.putItem( {
    TableName: CONNECTIONS_TABLE,
    Item: {
      connectionId: {S: connectionId},
      emailAddress: {S: emailAddress}
    }
  } ).promise();
  console.log( `Created emailAddress:${emailAddress} for connectionId:${connectionId}` );
  return {statusCode: 200, body: 'Connected to websocket.'}
}
