import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAABnQcRESMd3gwnxgY3Mbvj1n8flBhg-k',
  authDomain: 'monster-challenge-edbce.firebaseapp.com',
  projectId: 'monster-challenge-edbce',
  storageBucket: 'monster-challenge-edbce.firebasestorage.app',
  messagingSenderId: '103445026096',
  appId: '1:103445026096:web:94e021f079af29cc2b24f5'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
