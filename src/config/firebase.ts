import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Firebase Configuration - Hardcoded for GitHub Pages deployment
// Get this from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCF5Wrw79_2NEEDUKcK-77h8OgGwEtJULM",
  authDomain: "mtctraining-24d30.firebaseapp.com",
  projectId: "mtctraining-24d30",
  storageBucket: "mtctraining-24d30.firebasestorage.app",
  messagingSenderId: "451521307521",
  appId: "1:451521307521:web:7ce37e1ea5683d551efe80",
  databaseURL: "https://mtctraining-24d30.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Realtime Database
export const rtdb = getDatabase(app);

// Enable emulator for development (optional)
// Uncomment these lines to test with Firebase emulator
// if (import.meta.env.DEV) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectDatabaseEmulator(rtdb, 'localhost', 9000);
// }
