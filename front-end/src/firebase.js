// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRad-QGg29usiYB9Aqr-41sINckHqN0TQ",
  authDomain: "chat-app-c44ba.firebaseapp.com",
  projectId: "chat-app-c44ba",
  storageBucket: "chat-app-c44ba.appspot.com",
  messagingSenderId: "944077953030",
  appId: "1:944077953030:web:adfa341908079f64da8b87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {app,auth};