import {APIGatewayProxyHandler} from "aws-lambda";
import {DynamoDB} from "aws-sdk";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!
export const handler: APIGatewayProxyHandler = async ( event ) => {
  const connectionId = event.requestContext.connectionId!
  const dynamo = new DynamoDB();
  await dynamo.deleteItem( {
    TableName: CONNECTIONS_TABLE,
    Key: {
      connectionId: {
        S: connectionId
      }
    }
  } ).promise()

  return {statusCode: 200, body: 'Disconnected from websocket.'}
}
