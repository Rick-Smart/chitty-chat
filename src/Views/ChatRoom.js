import React, { useContext, useState, useRef, useMemo, useEffect } from "react";

import AuthContext from "../auth/context";
import {
  auth,
  fireStore,
  useCollection,
  collection,
  query,
  orderBy,
  limit,
} from "../auth/firebaseConfig";

import * as fireBaseActions from "../actions/firebaseActions";

import AppButton from "../components/appButton/AppButton";
import ChatMessage from "../components/chatMessage/ChatMessage";

function ChatRoom() {
  const [messages, setMessages] = useState("");
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  const userContext = useContext(AuthContext);
  const userData = userContext.user.user;

  // // creating a reference to our messages collection - "messages" in our DB - "fireStore"
  // const messagesRef = collection(fireStore, "messages");
  // // structuring our query to the data base
  // const q = query(messagesRef, orderBy("createdAt"), limit(25));
  // // making our actual call to firebase combining our ref and query in the () of useCollection
  // const [value, loading, error] = useCollection(q, {
  //   snapshotListenOptions: { includeMetadataChanges: true },
  // });

  // const messages = useMemo(() => value, [value]);

  // useEffect(() => {
  //   dummy.current.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const logOut = async () => {
    await auth.signOut();
    userContext.setUser(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    // making sure blank values cant be sent to DB
    if (!formValue) return;
    // structuring the data to be in the correct format for our action
    const data = {
      text: formValue,
      sender: userData.uid,
      image: userData.photoURL,
    };
    // actual call to DB to save formValue
    fireBaseActions.fireStoreCreate.message(data);
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageInThread = async (e) => {
    e.preventDefault();
    // making sure blank values cant be sent to DB
    if (!formValue) return;

    // structuring the data to be in the correct format for our action
    const data = {
      text: formValue,
      sender: userData.uid,
      image: userData.photoURL,
    };

    // actual call to DB to save formValue
    fireBaseActions.fireStoreCreate.messageInThread(data);

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const findThread = async () => {
    const threadId = "fBeSTsPniPs4YfFrMks4";
    const data = await fireBaseActions.fireStoreCollectionsById.threads(
      threadId
    );
    console.log(data.messages);
    setMessages(data.messages);
  };

  return (
    <>
      <header className="App-header">
        <h3>Chitty-Chat</h3>
        <img className="profile-image" src={userData.photoURL} alt="user" />
        <h3>{userData.displayName}</h3>
        <AppButton buttonClass="sign-in" action={logOut} title="Log Out" />
      </header>

      <main>
        <AppButton
          buttonClass="sign-in"
          action={findThread}
          title="Find Thread By ID"
        />
        {/* {messages &&
          messages.docs.map((msg) => (
            <ChatMessage key={msg.id} message={msg.data()} />
          ))} */}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessageInThread}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default ChatRoom;
