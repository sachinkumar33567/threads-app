// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "threads-app-d5e9a.firebaseapp.com",
  projectId: "threads-app-d5e9a",
  storageBucket: "threads-app-d5e9a.appspot.com",
  messagingSenderId: "19991135994",
  appId: "1:19991135994:web:695cf6946290379646ab43"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);