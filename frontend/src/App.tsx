import React, {useEffect, useState} from 'react';
import {Table} from "react-bootstrap";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {Message, MessageComponent} from "./MessageComponent";

function App()
{
  const [getEmailAddress, setEmailAddress] = useState<string | undefined>()
  const [getMessages, setMessages] = useState<Message[]>( [] )
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket( process.env.REACT_APP_WEBSOCKET_ENDPOINT!, {
    onOpen: () => {
      console.log( 'Websocket opened.' );
      sendJsonMessage( {request: 'emailAddress'} );
    },
    onMessage: ( event ) => {
      const json = JSON.parse( event.data );
      if ( json.emailAddress )
      {
        setEmailAddress( `${json.emailAddress}@sunbrobot.com` )
        return;
      }
      setMessages( ( x ) => x.concat( json ) );
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: ( closeEvent ) => true,
  } );
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  return (
    <div className="App">
      <p>
        Email: {getEmailAddress}
      </p>
      <p>
        Status: {connectionStatus}
      </p>
      <div>
        Messages:<br />
        <Table
          striped
          bordered
          hover>
          <thead>
          <tr>
            <th>From</th>
            <th>Subject</th>
            <th>Date</th>
          </tr>
          </thead>
          <tbody>
          {getMessages.map( message => {
            return (
              <MessageComponent
                key={`${message.timestamp}-${message.from}-${message.subject}`}
                message={message} />
            )
          } )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
