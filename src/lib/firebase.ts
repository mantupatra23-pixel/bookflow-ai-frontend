import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpa6YdbXL_cZQxD5nfJrfj6iHQmeHGs1M",
  authDomain: "bookflow-ai-5f80d.firebaseapp.com",
  projectId: "bookflow-ai-5f80d",
  storageBucket: "bookflow-ai-5f80d.firebasestorage.app",
  messagingSenderId: "743713360048",
  appId: "1:743713360048:web:7e24061a3b6f5c869cd375",
  measurementId: "G-9RJ0MPV93S"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
