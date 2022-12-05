import React, { useContext } from "react";

import AuthContext from "../../auth/context";

function ChatMessage({ message }) {
  const userContext = useContext(AuthContext);
  const userData = userContext.user.user;

  // console.log("full message: ", message);
  // console.log("sender uid: ", message.sender);
  // console.log("user context: ", userData);

  const messageClass = message.sender === userData.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={message.imageURL} alt="sender profile" />
      <p>{message.text}</p>
    </div>
  );
}

export default ChatMessage;
