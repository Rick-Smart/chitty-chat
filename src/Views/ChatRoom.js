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
  addDoc,
  serverTimestamp,
} from "../auth/firebaseConfig";

import AppButton from "../components/appButton/AppButton";
import ChatMessage from "../components/chatMessage/ChatMessage";

function ChatRoom() {
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  const userContext = useContext(AuthContext);
  const userData = userContext.user.user;

  // creating a reference to our messages collection - "messages" in our DB - "fireStore"
  const messagesRef = collection(fireStore, "messages");
  // structuring our query to the data base
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  // making our actual call to firebase combining our ref and query in the () of useCollection
  const [value, loading, error] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const messages = useMemo(() => value, [value]);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const logOut = async () => {
    await auth.signOut();
    userContext.setUser(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    // making sure blank valus cant be sent to DB
    if (!formValue) return;

    // actual call to DB to save formValue
    await addDoc(messagesRef, {
      text: formValue,
      sender: userData.uid,
      imageURL: userData.photoURL,
      createdAt: serverTimestamp(),
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const deleteMessage = (key) => {
    const newMessageList = messages.filter((message) => message.key !== key);
    console.log(newMessageList);
  };

  return (
    <>
      <div>
        <img src={userData.photoURL} alt="user" />
        <h3>{userData.displayName}</h3>
      </div>
      <AppButton buttonClass="sign-in" action={logOut} title="Log Out" />
      <main>
        {messages &&
          messages.docs.map((msg) => (
            <ChatMessage key={msg.id} message={msg.data()} />
          ))}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
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
