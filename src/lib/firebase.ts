/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const isDummy = firebaseConfig.apiKey === 'dummy-api-key-for-local-build-only';

let app: any;
let dbInstance: any;
let authInstance: any;
let googleProviderInstance: any;

if (!isDummy) {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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

