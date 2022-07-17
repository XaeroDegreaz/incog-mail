import React from "react";

export interface Message {
  from: string
  subject: string
  timestamp: Date
  data: string
}

interface Props {
  message: Message
}

export const MessageComponent: React.FC<Props> = ( {message} ) => {
  return (
    <tr>
      <td>{message.from}</td>
      <td>{message.subject}</td>
      <td>
        {message.timestamp.toString()}
      </td>
    </tr>
  )
}
