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
import { INITIAL_CONTENT } from '../constants';

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
const GITHUB_OWNER = 'talktophoenixwaterproofing-ctrl';
const GITHUB_REPO = 'phoenixwater';
const GITHUB_PATH = 'public/content.json';

function getLocalContent(): SiteContent {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Clean merge to prevent schema drift crashes
      return {
        ...INITIAL_CONTENT,
        ...parsed,
        businessInfo: { ...INITIAL_CONTENT.businessInfo, ...(parsed.businessInfo || {}) },
        seo: { ...INITIAL_CONTENT.seo, ...(parsed.seo || {}) },
        services: parsed.services || INITIAL_CONTENT.services,
        pastWorks: parsed.pastWorks || INITIAL_CONTENT.pastWorks,
        testimonials: parsed.testimonials || INITIAL_CONTENT.testimonials,
        updatedAt: parsed.updatedAt
      };
    }
    // Seed localStorage on very first visit
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTENT));
    return INITIAL_CONTENT;
  } catch (e) {
    console.warn('LocalStorage is unavailable:', e);
    return INITIAL_CONTENT;
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
  // First, always attempt to fetch latest deployed static content.json
  try {
    const res = await fetch(`/content.json?t=${Date.now()}`);
    if (res.ok) {
      const parsed = await res.json();
      const merged = {
        ...INITIAL_CONTENT,
        ...parsed,
        businessInfo: { ...INITIAL_CONTENT.businessInfo, ...(parsed.businessInfo || {}) },
        seo: { ...INITIAL_CONTENT.seo, ...(parsed.seo || {}) },
        services: parsed.services || INITIAL_CONTENT.services,
        pastWorks: parsed.pastWorks || INITIAL_CONTENT.pastWorks,
        testimonials: parsed.testimonials || INITIAL_CONTENT.testimonials,
        updatedAt: parsed.updatedAt || 0
      };

      const local = getLocalContent();
      // Skip overwrite if local content has a newer timestamp
      if (local && local.updatedAt && merged.updatedAt && local.updatedAt > merged.updatedAt) {
        return local;
      }

      saveLocalContent(merged);
      return merged;
    }
  } catch (e) {
    console.warn("Static content.json load failed, using fallbacks:", e);
  }

  if (isDummy || import.meta.env.VITE_GITHUB_TOKEN) {
    return getLocalContent();
  }

  try {
    const docRef = doc(db, CONTENT_PATH);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SiteContent;
      // Clean merge to prevent schema drift crashes
      const mergedData = {
        ...INITIAL_CONTENT,
        ...data,
        businessInfo: { ...INITIAL_CONTENT.businessInfo, ...(data.businessInfo || {}) },
        seo: { ...INITIAL_CONTENT.seo, ...(data.seo || {}) },
        services: data.services || INITIAL_CONTENT.services,
        pastWorks: data.pastWorks || INITIAL_CONTENT.pastWorks,
        testimonials: data.testimonials || INITIAL_CONTENT.testimonials,
        updatedAt: data.updatedAt
      };
      saveLocalContent(mergedData);
      return mergedData;
    }
  } catch (error) {
    console.warn('Firestore GET failed, falling back to LocalStorage:', error);
  }
  return getLocalContent();
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  const contentWithTimestamp = {
    ...content,
    updatedAt: Date.now()
  };

  // Always save to LocalStorage first to guarantee persistence
  saveLocalContent(contentWithTimestamp);
  
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
  if (githubToken) {
    console.log("Git-CMS mode detected. Committing changes directly to GitHub...");
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
    const headers = {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    try {
      // 1. Fetch current file SHA
      const getRes = await fetch(url, { headers });
      let sha = '';
      if (getRes.status === 200) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // 2. Commit updated JSON content
      const contentStr = JSON.stringify(contentWithTimestamp, null, 2);
      // UTF-8 base64 encoding
      const base64Content = btoa(unescape(encodeURIComponent(contentStr)));

      const putRes = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'CMS updates committed via Admin Console',
          content: base64Content,
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (putRes.status === 200 || putRes.status === 201) {
        console.log('Successfully committed site content to GitHub!');
      } else {
        const errData = await putRes.json();
        console.warn('GitHub API commit failed:', errData);
        throw new Error(errData.message || 'GitHub commit failed');
      }
    } catch (error) {
      console.error('Error committing changes to GitHub:', error);
      throw error;
    }
    return;
  }

  if (isDummy) {
    return;
  }

  try {
    const docRef = doc(db, CONTENT_PATH);
    await setDoc(docRef, contentWithTimestamp);
  } catch (error) {
    console.warn('Firestore WRITE failed, local fallback was successful:', error);
  }
}

export function subscribeToContent(onUpdate: (content: SiteContent) => void) {
  // First, always load content.json statically
  const loadStatic = async () => {
    try {
      const res = await fetch(`/content.json?t=${Date.now()}`);
      if (res.ok) {
        const parsed = await res.json();
        const merged = {
          ...INITIAL_CONTENT,
          ...parsed,
          businessInfo: { ...INITIAL_CONTENT.businessInfo, ...(parsed.businessInfo || {}) },
          seo: { ...INITIAL_CONTENT.seo, ...(parsed.seo || {}) },
          services: parsed.services || INITIAL_CONTENT.services,
          pastWorks: parsed.pastWorks || INITIAL_CONTENT.pastWorks,
          testimonials: parsed.testimonials || INITIAL_CONTENT.testimonials,
          updatedAt: parsed.updatedAt || 0
        };

        const local = getLocalContent();
        // Skip overwrite if local content has a newer timestamp
        if (local && local.updatedAt && merged.updatedAt && local.updatedAt > merged.updatedAt) {
          onUpdate(local);
          return;
        }

        saveLocalContent(merged);
        onUpdate(merged);
        return;
      }
    } catch (e) {
      console.warn("Failed to fetch static content.json, falling back to LocalStorage:", e);
    }
    
    // Seed with LocalStorage content immediately if fetch fails
    const initialLocal = getLocalContent();
    if (initialLocal) {
      onUpdate(initialLocal);
    }
  };

  const hasGitCms = !!import.meta.env.VITE_GITHUB_TOKEN;
  const isFirestoreMode = !isDummy && !hasGitCms;

  if (isFirestoreMode) {
    // Load local content immediately
    const local = getLocalContent();
    if (local) {
      onUpdate(local);
    } else {
      loadStatic();
    }
  } else {
    loadStatic();
  }

  if (hasGitCms || isDummy) {
    return () => {};
  }

  try {
    const docRef = doc(db, CONTENT_PATH);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteContent;
        // Clean merge with INITIAL_CONTENT to prevent schema drift crashes
        const mergedData = {
          ...INITIAL_CONTENT,
          ...data,
          businessInfo: { ...INITIAL_CONTENT.businessInfo, ...(data.businessInfo || {}) },
          seo: { ...INITIAL_CONTENT.seo, ...(data.seo || {}) },
          services: data.services || INITIAL_CONTENT.services,
          pastWorks: data.pastWorks || INITIAL_CONTENT.pastWorks,
          testimonials: data.testimonials || INITIAL_CONTENT.testimonials,
          updatedAt: data.updatedAt
        };

        // Only update if Firestore content is newer or equal to local content
        const local = getLocalContent();
        if (local && local.updatedAt && mergedData.updatedAt && local.updatedAt > mergedData.updatedAt) {
          return;
        }

        saveLocalContent(mergedData);
        onUpdate(mergedData);
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


