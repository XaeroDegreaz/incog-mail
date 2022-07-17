import React, {useEffect, useState} from 'react';
import {Tab, Table, Tabs} from "react-bootstrap";
import CopyToClipboard from 'react-copy-to-clipboard';
import useWebSocket, {ReadyState} from "react-use-websocket";
import {Message, MessageComponent} from "./MessageComponent";
import {MessageContentComponent} from "./MessageContentComponent";

function App()
{
  const [getEmailAddress, setEmailAddress] = useState<string | undefined>()
  const [getMessages, setMessages] = useState<Message[]>( [] )
  const [getSelectedMessage, setSelectedMessage] = useState<Message | undefined>()
  const [getActiveTab, setActiveTab] = useState( 'inbox' );
  const [getEmailCopied, setEmailCopied] = useState( false )
  const {sendJsonMessage, readyState,} = useWebSocket( process.env.REACT_APP_WEBSOCKET_ENDPOINT!, {
    onOpen: () => {
      console.log( 'Websocket opened.' );
      sendJsonMessage( {request: 'emailAddress'} );
    },
    onMessage: ( event ) => {
      const json = JSON.parse( event.data );
      if ( json.emailAddress )
      {
        setEmailAddress( `${json.emailAddress}@sunbrobot.com` )
        setEmailCopied( false );
        return;
      }
      setMessages( ( x ) => x.concat( json ) );
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: ( closeEvent ) => true,
  } );
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  return (
    <div style={{margin: 10}}>
      <p>
        <b>Email:</b> {getEmailAddress} &nbsp;
        <CopyToClipboard
          text={getEmailAddress!}
          onCopy={() => setEmailCopied( true )}>
          <button>Copy to clipboard</button>
        </CopyToClipboard> &nbsp;
        {getEmailCopied ? <span style={{color: 'red'}}>Copied.</span> : null}
      </p>
      <p>
        <b>Status:</b> {connectionStatus}
      </p>
      <Tabs
        id="controlled-tab-example"
        activeKey={getActiveTab}
        onSelect={( k ) => setActiveTab( k! )}
        className="mb-3">
        <Tab
          eventKey="inbox"
          title="Inbox">
          <div>
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
                    message={message}
                    onMessageSelected={( m ) => {
                      setSelectedMessage( message );
                      setActiveTab( 'message' )
                    }} />
                )
              } )}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab
          title={'Message'}
          eventKey={'message'}>
          <MessageContentComponent message={getSelectedMessage} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
