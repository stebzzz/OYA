import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDFYAxry4pC8b2urTH7EgWfkeTI5r9ySAg",
  authDomain: "synapseai-a1290.firebaseapp.com",
  projectId: "synapseai-a1290",
  storageBucket: "synapseai-a1290.firebasestorage.app",
  messagingSenderId: "65881787673",
  appId: "1:65881787673:web:4724020c42141e13a6c988",
  measurementId: "G-K058WQ2XC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;