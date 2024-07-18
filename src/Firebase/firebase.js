import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCTPHB0CqN4nlcSVRnOwpiJt8ZmVKl4dxY",
  authDomain: "relogio-ponto-1c5e8.firebaseapp.com",
  projectId: "relogio-ponto-1c5e8",
  storageBucket: "relogio-ponto-1c5e8.appspot.com",
  messagingSenderId: "291769538097",
  appId: "1:291769538097:web:6bb2e114ed8006b69ae710",
  measurementId: "G-3CG992YCH7",
});

export const auth = getAuth(firebaseConfig);
