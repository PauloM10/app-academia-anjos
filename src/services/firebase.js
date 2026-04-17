import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPfwTR5LgAtzfigpvxZYQ522HhpzodhPA",
  authDomain: "taekwondo-app-3ee7e.firebaseapp.com",
  projectId: "taekwondo-app-3ee7e",
  storageBucket: "taekwondo-app-3ee7e.firebasestorage.app",
  messagingSenderId: "641683563678",
  appId: "1:641683563678:web:fbad3258669dd279f8478f",
  measurementId: "G-HZ3DB5B3JJ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const secondaryApp =
  getApps().find((item) => item.name === "secondary") ||
  initializeApp(firebaseConfig, "secondary");

export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;