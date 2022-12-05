import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "@firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { fireStore } from "../auth/firebaseConfig";

const getThreadsById = async (id) => {
  const threadRef = doc(fireStore, "threads", id);
  const docSnap = await getDoc(threadRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return "No Thread Found";
  }
};

const getMessageById = async (id) => {
  const messageRef = doc(fireStore, "messages", id);
  const docSnap = await getDoc(messageRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return "No message Found";
  }
};
const getUserById = async (id) => {
  const userRef = doc(fireStore, "users", id);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return "No User Found";
  }
};
// this is for selecting the collection by it's id, must provide id
const fireStoreCollectionsById = {
  messages: getMessageById,
  users: getUserById,
  threads: getThreadsById,
};

// this is for targeting the entire collection
// used in all of our create methods
const fireStoreCollections = {
  users: collection(fireStore, "users"),
  messages: collection(fireStore, "messages"),
  threads: collection(fireStore, "threads"),
};

// Must include userId*
const createUser = async (id) => {
  await addDoc(fireStoreCollections.users, {
    id,
    online: true,
    createdAt: serverTimestamp(),
  });
};
// MUST include userId*
const createThread = async (userId) => {
  await addDoc(fireStoreCollections.threads, {
    members: [userId],
    messages: [],
    createdAt: serverTimestamp(),
  });
};
// MUST provide message object with keys text, sender, imageURL
const createMessage = async (message) => {
  await addDoc(fireStoreCollections.messages, {
    text: message.text,
    sender: message.sender,
    imageURL: message.image,
    createdAt: serverTimestamp(),
  });
};
// Trying to create a message in a thread
const createMessageInThread = async (message) => {
  const threadRef = fireStoreCollectionsById.threads("fBeSTsPniPs4YfFrMks4");
  await addDoc(threadRef, "messages", {
    text: message.text,
    sender: message.sender,
    imageURL: message.image,
    createdAt: serverTimestamp(),
  });
};

// these are all of our custom create* methods for our DB
const fireStoreCreate = {
  user: createUser,
  thread: createThread,
  message: createMessage,
  messageInThread: createMessageInThread,
};

export { createUser, createThread, fireStoreCollectionsById, fireStoreCreate };
