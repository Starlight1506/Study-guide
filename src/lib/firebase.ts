import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// OAuth scopes required for sending 30-minute pre-lesson reminders via Gmail
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Cache the access token in memory only (never in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;

export const googleAuthProvider = new GoogleAuthProvider();
SCOPES.forEach((scope) => googleAuthProvider.addScope(scope));

export function initAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    callback(user);
  });
}

export interface BackendGmailStatus {
  gmailApiReady: boolean;
  smtpConfigured: boolean;
  ready: boolean;
  activeProvider: 'gmail_api' | 'smtp' | 'client_oauth_required';
  senderEmail: string | null;
  smtpHost: string;
  schedulerActive: boolean;
  preLessonMinutes: number;
  updatedAt: string | null;
}

export async function syncTokenToBackend(token: string | null, email?: string | null): Promise<void> {
  try {
    await fetch('/api/gmail/sync-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        email: email || auth.currentUser?.email || null,
        clear: !token,
      }),
    });
  } catch {
    // Non-fatal sync
  }
}

export async function getBackendGmailStatus(): Promise<BackendGmailStatus | null> {
  try {
    const res = await fetch('/api/gmail/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function googleSignIn(): Promise<{ user: User; accessToken: string | null }> {
  const provider = new GoogleAuthProvider();
  SCOPES.forEach((scope) => provider.addScope(scope));

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  cachedAccessToken = credential?.accessToken ?? null;

  if (cachedAccessToken) {
    await syncTokenToBackend(cachedAccessToken, result.user.email);
  }

  return {
    user: result.user,
    accessToken: cachedAccessToken,
  };
}

export function hasCachedAccessToken(): boolean {
  return Boolean(cachedAccessToken);
}

export async function getAccessToken(): Promise<string> {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  if (auth.currentUser) {
    const { accessToken } = await googleSignIn();
    if (accessToken) {
      return accessToken;
    }
  }

  throw new Error('NEEDS_AUTH');
}

export async function logout(): Promise<void> {
  cachedAccessToken = null;
  await syncTokenToBackend(null);
  await signOut(auth);
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function utf8ToBase64Url(str: string): string {
  return utf8ToBase64(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendGmailReminder(params: {
  to: string;
  subject: string;
  bodyText: string;
  studentName?: string;
  groupName?: string;
  timeSlot?: string;
  room?: string;
}): Promise<{ id: string; provider?: string }> {
  const cleanTo = params.to.trim();

  // Check if backend SMTP is already configured or we have a client OAuth token
  let token: string | null = cachedAccessToken;
  if (!token) {
    const backendStatus = await getBackendGmailStatus();
    if (!backendStatus?.ready) {
      token = await getAccessToken();
    }
  }

  // 1. Dispatch via Backend (Server-side Gmail API or SMTP service)
  try {
    const backendResp = await fetch('/api/gmail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        to: cleanTo,
        subject: params.subject,
        bodyText: params.bodyText,
        studentName: params.studentName,
        groupName: params.groupName,
        timeSlot: params.timeSlot,
        room: params.room,
        senderEmail: auth.currentUser?.email || null,
      }),
    });

    if (backendResp.ok) {
      return await backendResp.json();
    }

    if (backendResp.status === 401 || backendResp.status === 403) {
      cachedAccessToken = null;
      throw new Error('NEEDS_AUTH');
    }
  } catch (err: any) {
    if (err?.message === 'NEEDS_AUTH') {
      throw err;
    }
    // Fallback to direct client-side Gmail API call if backend route encountered a transient error
  }

  // 2. Fallback: Direct Gmail REST API call with client OAuth token
  const activeToken = token || (await getAccessToken());
  const encodedSubject = `=?utf-8?B?${utf8ToBase64(params.subject)}?=`;

  const emailLines = [
    `To: ${cleanTo}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    `Subject: ${encodedSubject}`,
    '',
    params.bodyText,
  ];
  const rawEmail = emailLines.join('\r\n');
  const encodedMessage = utf8ToBase64Url(rawEmail);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    cachedAccessToken = null;
    throw new Error('NEEDS_AUTH');
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gmail API xatosi (${response.status})`);
  }

  return response.json();
}


