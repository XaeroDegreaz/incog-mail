import {Function, StackContext, WebSocketApi} from "@serverless-stack/resources";
import {ReceiptRuleSet} from "aws-cdk-lib/aws-ses";
import {Lambda, LambdaInvocationType, Sns} from "aws-cdk-lib/aws-ses-actions";
import {Topic} from "aws-cdk-lib/aws-sns";
import {LambdaSubscription} from "aws-cdk-lib/aws-sns-subscriptions";

export function MyStack( {stack, app}: StackContext )
{
  const getPrefix = () => `${app.stage}-${app.name}`;
  const sesIncomingHandler = new Function( stack, `${getPrefix()}-SesIncomingHandler`, {
    handler: 'functions/sesIncomingHandler.handler',
    functionName: `${getPrefix()}-SesIncomingHandler`
  } );

  const topic = new Topic( stack, `${getPrefix()}-SnsTopic`, {
    topicName: `${getPrefix()}-SnsTopic`
  } );

  topic.addSubscription( new LambdaSubscription( sesIncomingHandler ) )

  const receiptRuleSet = new ReceiptRuleSet( stack, `${getPrefix()}-ReceiptRuleSet`, {
    rules: [
      {
        actions: [
          new Sns( {topic} )
        ],
        recipients: ['foo@sunbrobot.com'],
        receiptRuleName: `${getPrefix()}-ReceiptRule`
      }
    ],
    receiptRuleSetName: `${getPrefix()}-ReceiptRuleSet`
  } )

  const webSocket = new WebSocketApi( stack, `${getPrefix()}-WebSocketApi`, {
    routes: {
      $connect: "functions/connect.handler",
      $disconnect: "functions/disconnect.handler"
    }
  } );

  stack.addOutputs( {
    WebsocketApiEndpoint: webSocket.url
  } );
}
