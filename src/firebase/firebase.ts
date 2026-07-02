// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNQfgjnJLxmVgCQkUSbVgIOv0YBUcgkJI",
  authDomain: "social-media-app-68acc.firebaseapp.com",
  projectId: "social-media-app-68acc",
  storageBucket: "social-media-app-68acc.firebasestorage.app",
  messagingSenderId: "1050459260180",
  appId: "1:1050459260180:web:bfbee4a113b632a9aaae01",
  measurementId: "G-MYH8VPK18N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);