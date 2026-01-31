// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACs8tUrsJMAhMG7QPiBWMaKA63cpvlFl0",
  authDomain: "fer-martinez-dev.firebaseapp.com",
  projectId: "fer-martinez-dev",
  storageBucket: "fer-martinez-dev.firebasestorage.app",
  messagingSenderId: "957743340960",
  appId: "1:957743340960:web:b9bf3b3a158ea37f2858c5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);