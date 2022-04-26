// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAapAgl6TXARwFs4Y4Xx6zUz-Gw8Ft5guI",
  authDomain: "forum-mma.firebaseapp.com",
  projectId: "forum-mma",
  storageBucket: "forum-mma.appspot.com",
  messagingSenderId: "676054372556",
  appId: "1:676054372556:web:da5272dc82b0d4d1e33269",
  measurementId: "G-6G3RLL9E9G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// initialize authentication and provider and export
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// initialize database storage
export const db = getFirestore(app);
