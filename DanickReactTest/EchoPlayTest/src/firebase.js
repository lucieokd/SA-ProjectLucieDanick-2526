// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJciiNlRJPWdtcJLd2F4PB_-z6bj5hyRk",
  authDomain: "echoplayfb.firebaseapp.com",
  projectId: "echoplayfb",
  storageBucket: "echoplayfb.firebasestorage.app",
  messagingSenderId: "90796989827",
  appId: "1:90796989827:web:6d701407c2f70a955eeab6",
  measurementId: "G-VZ5QLDXNDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
