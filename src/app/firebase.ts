import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { runtimeEnv } from './runtime-env';

const firebaseConfig = {
  apiKey: runtimeEnv.FIREBASE_API_KEY,
  authDomain: runtimeEnv.FIREBASE_AUTH_DOMAIN,
  projectId: runtimeEnv.FIREBASE_PROJECT_ID,
  storageBucket: runtimeEnv.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: runtimeEnv.FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeEnv.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
