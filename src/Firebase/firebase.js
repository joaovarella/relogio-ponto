import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCTPHB0CqN4nlcSVRnOwpiJt8ZmVKl4dxY",
  authDomain: "relogio-ponto-1c5e8.firebaseapp.com",
  projectId: "relogio-ponto-1c5e8",
  storageBucket: "relogio-ponto-1c5e8.appspot.com",
});

export const auth = getAuth(firebaseConfig);
