import React, { useState } from "react";
import "./App.css";

import ChatRoom from "./Views/ChatRoom";
import SignIn from "./Views/SignIn";

import AuthContext from "./auth/context";

function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="App">
        <header className="App-header">Chitty Chat</header>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
