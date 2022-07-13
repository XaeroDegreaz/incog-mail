import {SNSHandler} from "aws-lambda";

interface SesMessage {
  notificationType:string;
  mail: {
    timestamp:string;
    destination:string[];
    source:string;
    commonHeaders: {
      subject:string;
    };
    content:string;
  }
}
export const handler: SNSHandler = async ( event ) => {
  console.log( {event} )
  const record = event.Records[0];
  const sns = record.Sns;
  const ses = JSON.parse(sns.Message) as SesMessage;
  console.log(JSON.stringify(ses));
  //# Lookup client by email address
  //# not found, then no op.
  //# found, but 410 (GoneException) delete from dynamo
  //# happy-path send to client.
}
