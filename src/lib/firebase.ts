/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Support overriding Firebase config via Vite environment variables for secure Netlify deployments
const activeConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "(default)"
};

export const isDummy = activeConfig.apiKey === 'dummy-api-key-for-local-build-only' || !activeConfig.apiKey;

let app: any;
let dbInstance: any;
let authInstance: any;
let googleProviderInstance: any;

if (!isDummy) {
  app = initializeApp(activeConfig);
  dbInstance = getFirestore(app, activeConfig.firestoreDatabaseId);
  authInstance = getAuth(app);
  googleProviderInstance = new GoogleAuthProvider();

  // Validation call per skill requirement
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(dbInstance, 'test', 'connection'));
    } catch (error: any) {
      if (error?.message?.includes('offline')) {
        console.warn("Firebase client is offline. Check connection.");
      }
    }
  };
  testConnection();
} else {
  console.log("CMS running in offline LocalStorage mode (dummy Firebase API key detected).");
  dbInstance = {} as any;
  authInstance = { currentUser: null } as any;
  googleProviderInstance = {} as any;
}

export const db = dbInstance;
export const auth = authInstance;
export const googleProvider = googleProviderInstance;

export const loginWithGoogle = () => {
  if (isDummy) {
    console.log("Local Login With Google triggered.");
    return Promise.resolve({ user: null });
  }
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  if (isDummy) {
    return Promise.resolve();
  }
  return auth.signOut();
};

