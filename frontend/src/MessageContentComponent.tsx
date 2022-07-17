import React from "react";
import {Message} from "./MessageComponent";

export const MessageContentComponent: React.FC<{ message: Message | undefined }> = ( {message} ) => {
  return (
    //# This seems like it could be dangerous :)
    //# Probably need to add some sort of toggle to force plaintext.
    <div dangerouslySetInnerHTML={{__html: message?.data!}} />
  )
}
