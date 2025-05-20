import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFYAxry4pC8b2urTH7EgWfkeTI5r9ySAg",
  authDomain: "synapseai-a1290.firebaseapp.com",
  projectId: "synapseai-a1290",
  storageBucket: "synapseai-a1290.appspot.com",
  messagingSenderId: "65881787673",
  appId: "1:65881787673:web:4724020c42141e13a6c988",
  measurementId: "G-K058WQ2XC3"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Obtenir les instances Firestore, Auth et Analytics
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

export default app;