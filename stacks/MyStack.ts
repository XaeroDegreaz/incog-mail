import {Function, StackContext, Table, WebSocketApi} from "@serverless-stack/resources";
import {ReceiptRuleSet} from "aws-cdk-lib/aws-ses";
import {Sns} from "aws-cdk-lib/aws-ses-actions";
import {Topic} from "aws-cdk-lib/aws-sns";
import {LambdaSubscription} from "aws-cdk-lib/aws-sns-subscriptions";

export function MyStack( {stack, app}: StackContext )
{
  const getPrefix = () => `${app.stage}-${app.name}`;
  const table = new Table( stack, `ConnectionToAddressTable`, {
    fields: {
      connectionId: "string",
      emailAddress: "string"
    },
    primaryIndex: {partitionKey: 'connectionId'},
    globalIndexes: {
      EmailToConnectionIdIndex: {partitionKey: 'emailAddress', projection: "keys_only"}
    }
  } )

  const CONNECTIONS_TABLE = table.tableName

  const topic = new Topic( stack, `SnsTopic`, {
    topicName: `${getPrefix()}-SnsTopic`
  } );

  const receiptRuleSet = new ReceiptRuleSet( stack, `ReceiptRuleSet`, {
    receiptRuleSetName: `${getPrefix()}-ReceiptRuleSet`,
    rules: [
      {
        actions: [
          new Sns( {topic} )
        ],
        recipients: ['sunbrobot.com'],
        receiptRuleName: `${getPrefix()}-ReceiptRule`
      }
    ]
  } )

  const webSocket = new WebSocketApi( stack, `WebSocketApi`, {
    routes: {
      $connect: new Function( stack, 'WebSocketOnConnect', {
        functionName: `${getPrefix()}-WebSocketOnConnect`,
        handler: "functions/connect.handler",
        environment: {CONNECTIONS_TABLE}
      } ),
      $disconnect: new Function( stack, 'WebSocketOnDisconnect', {
        functionName: `${getPrefix()}-WebSocketOnDisconnect`,
        handler: "functions/disconnect.handler",
        environment: {CONNECTIONS_TABLE}
      } ),
      $default: new Function( stack, 'WebSocketCreateEmail', {
        functionName: `${getPrefix()}-WebSocketCreateEmail`,
        handler: "functions/retrieveEmail.handler",
        environment: {CONNECTIONS_TABLE}
      } )
    },
  } );

  webSocket.attachPermissions( [table] )

  const sesIncomingHandler = new Function( stack, `SesIncomingHandler`, {
    handler: 'functions/sesIncomingHandler.handler',
    environment: {CONNECTIONS_TABLE, WEBSOCKET_ENDPOINT: webSocket.url},
    functionName: `${getPrefix()}-SesIncomingHandler`
  } );

  sesIncomingHandler.attachPermissions( [table, webSocket] )
  topic.addSubscription( new LambdaSubscription( sesIncomingHandler ) )

  stack.addOutputs( {
    WebsocketApiEndpoint: webSocket.url,
    ConnectionTable: table.tableArn
  } );
  return {webSocket}
}
