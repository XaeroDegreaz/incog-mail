import React from "react";

export interface Message {
  from: string
  subject: string
  timestamp: Date
  data: string
}

interface Props {
  message: Message
  onMessageSelected: ( message: Message ) => void;
}

export const MessageComponent: React.FC<Props> = ( {message, onMessageSelected} ) => {
  return (
    <tr onClick={() => onMessageSelected( message )} style={{cursor: 'pointer'}}>
      <td>{message.from}</td>
      <td>{message.subject}</td>
      <td>
        {message.timestamp.toString()}
      </td>
    </tr>
  )
}
