// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl90by_JC3XE4O7qx8OlpeuuS1ck5RbkM",
  authDomain: "echoplay-17867.firebaseapp.com",
  projectId: "echoplay-17867",
  storageBucket: "echoplay-17867.firebasestorage.app",
  messagingSenderId: "196478541007",
  appId: "1:196478541007:web:ebda5eccce84aeb63aebba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
