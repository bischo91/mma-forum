import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router";

export default function Login() {
  const signInWithGoogle = () => {
    // Sign in with Google popup
    signInWithPopup(auth, provider).then((result) => {
      // Verify authentication
      //   setIsAuth(true);
      //   Identify if logged in with local storage
      localStorage.setItem("isAuth", true);
      console.log(auth.currentUser);
      //   navigate("/");
    });
  };
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
}
