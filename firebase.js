// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0MTkB22V6VoXeZZC0YnWd1vGiaE-m7v8",
  authDomain: "whatsapp-clone-d43f1.firebaseapp.com",
  projectId: "whatsapp-clone-d43f1",
  storageBucket: "whatsapp-clone-d43f1.appspot.com",
  messagingSenderId: "122155233357",
  appId: "1:122155233357:web:96e2af19872e967e96ec04"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };