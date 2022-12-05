import React, { useContext } from "react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";

import AuthContext from "../auth/context";

import AppButton from "../components/appButton/AppButton";

function SignIn() {
  const userContext = useContext(AuthContext);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      userContext.setUser({ user, token });
    });
    // const userInfo = await auth.signInWithPopup(provider);
  };

  return (
    <AppButton
      butonClass="button sign-in"
      action={login}
      title="Sign in with Google"
    />
  );
}

export default SignIn;
