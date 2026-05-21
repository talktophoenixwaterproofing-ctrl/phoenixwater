/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  FirestoreError 
} from 'firebase/firestore';
import { db, auth, isDummy } from '../lib/firebase';
import { SiteContent } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const CONTENT_PATH = 'content/site';
const STORAGE_KEY = 'phoenix_waterproofing_site_content';

function getLocalContent(): SiteContent | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('LocalStorage is unavailable:', e);
    return null;
  }
}

function saveLocalContent(content: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch (e) {
    console.warn('Failed to save to LocalStorage:', e);
  }
}

export async function getSiteContent(): Promise<SiteContent | null> {
  if (isDummy) {
    return getLocalContent();
  }

  try {
    const docRef = doc(db, CONTENT_PATH);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SiteContent;
      saveLocalContent(data);
      return data;
    }
  } catch (error) {
    console.warn('Firestore GET failed, falling back to LocalStorage:', error);
  }
  return getLocalContent();
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  // Always save to LocalStorage first to guarantee persistence
  saveLocalContent(content);
  
  if (isDummy) {
    return;
  }

  try {
    const docRef = doc(db, CONTENT_PATH);
    await setDoc(docRef, content);
  } catch (error) {
    console.warn('Firestore WRITE failed, local fallback was successful:', error);
    // Do not throw an error if we successfully persisted to LocalStorage
  }
}

export function subscribeToContent(onUpdate: (content: SiteContent) => void) {
  // Seed with LocalStorage content immediately to avoid empty states or loading lag
  const initialLocal = getLocalContent();
  if (initialLocal) {
    onUpdate(initialLocal);
  }

  if (isDummy) {
    return () => {};
  }

  try {
    const docRef = doc(db, CONTENT_PATH);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteContent;
        saveLocalContent(data);
        onUpdate(data);
      } else {
        const local = getLocalContent();
        if (local) onUpdate(local);
      }
    }, (error) => {
      console.warn('Firestore subscription failed, falling back to LocalStorage:', error);
      const local = getLocalContent();
      if (local) onUpdate(local);
    });
    return unsubscribe;
  } catch (error) {
    console.warn('Firestore subscribe error, using LocalStorage:', error);
    const local = getLocalContent();
    if (local) onUpdate(local);
    return () => {};
  }
}


