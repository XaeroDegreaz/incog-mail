import {SNSHandler} from "aws-lambda";
import {ApiGatewayManagementApi, AWSError, DynamoDB} from "aws-sdk";
import {simpleParser, AddressObject} from "mailparser";

interface SesMessage {
  content: string;
}

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!

export const handler: SNSHandler = async ( event ) => {
  const record = event.Records[0];
  const sns = record.Sns;
  const ses = JSON.parse( sns.Message ) as SesMessage;
  const parsed = await simpleParser( ses.content )
  const to = (<AddressObject>parsed.to).value[0].address
  const dynamo = new DynamoDB();
  const response = await dynamo.query( {
    TableName: CONNECTIONS_TABLE,
    IndexName: 'EmailToConnectionIdIndex',
    KeyConditionExpression: '#emailAddress = :emailAddress',
    ExpressionAttributeNames: {'#emailAddress': 'emailAddress'},
    ExpressionAttributeValues: {':emailAddress': {S: to!.split( '@' )[0]}},
    Limit: 1
  } ).promise()
  if ( !response.Items || response.Items.length === 0 )
  {
    console.log( `No connection found for emailAddress:${to}` );
    return;
  }
  const management = new ApiGatewayManagementApi( {
    endpoint: `${process.env.WEBSOCKET_ENDPOINT!.split( 'wss://' )[1]}`,
  } );
  const connectionId = response.Items?.[0].connectionId.S!
  const minimal = {
    from: parsed.from?.value[0].address,
    subject: parsed.subject,
    timestamp: parsed.date,
    data: parsed.html || parsed.text,
  }
  try
  {
    await management.postToConnection( {
      ConnectionId: connectionId,
      Data: JSON.stringify( minimal )
    } ).promise();
  }catch ( e ) {
    const error = e as AWSError;
    console.log({e})
  }
}
