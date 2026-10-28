import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const fdb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

export type GlobalCollectionKey =
  | 'students'
  | 'grades'
  | 'ratings'
  | 'homeworks'
  | 'submissions'
  | 'smartCoins'
  | 'teachers'
  | 'teacherEvaluations'
  | 'smsLogs'
  | 'meta';

const COLLECTION_MAP: Record<GlobalCollectionKey, string> = {
  students: 'portal_students',
  grades: 'portal_grades',
  ratings: 'portal_ratings',
  homeworks: 'portal_homeworks',
  submissions: 'portal_submissions',
  smartCoins: 'portal_coins',
  teachers: 'portal_teachers',
  teacherEvaluations: 'portal_evaluations',
  smsLogs: 'portal_sms_logs',
  meta: 'portal_meta',
};

const DEFAULT_STUDENTS = [
  {
    id: 'std_nafosat',
    fullName: 'Nafosat',
    login: 'nafosat',
    password: 'Nafosat@729#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_dilmurod',
    fullName: 'Dilmurod',
    login: 'dilmurod',
    password: 'Dilmurod@541#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_fozilaxmad',
    fullName: 'Fozilaxmad',
    login: 'fozilaxmad',
    password: 'Fozilaxmad@318#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_abdulaziz',
    fullName: 'Abdulaziz',
    login: 'abdulaziz',
    password: 'Abdulaziz@824#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_sunnatilla',
    fullName: 'Sunnatilla',
    login: 'sunnatilla',
    password: 'Sunnatilla@635#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_baxodir',
    fullName: 'Baxodir',
    login: 'baxodir',
    password: 'Baxodir@492#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_dovud',
    fullName: 'Dovud',
    login: 'dovud',
    password: 'Dovud@807#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_muso',
    fullName: 'Muso',
    login: 'muso',
    password: 'Muso@951#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_shoxruz',
    fullName: 'Shoxruz',
    login: 'shoxruz',
    password: 'Shoxruz@638#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_islomxoja',
    fullName: 'Islomxoja',
    login: 'islomxoja',
    password: 'Islomxoja@714#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_abdurahmon',
    fullName: 'Abdurahmon',
    login: 'abdurahmon',
    password: 'Abdurahmon@852#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_1792492596610',
    fullName: 'Sultonxon',
    login: 'sultonxon',
    password: 'Sultonxon@584#',
    gradeClass: '5-A sinf',
    enrolledTrack: 'both',
    phone: '',
    googleEmail: '',
    createdAt: '2026-10-26T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
];

const DEFAULT_TEACHERS = [
  {
    id: 'tch_assadxoja',
    fullName: 'Assadxoja',
    login: 'assadxoja',
    password: '@xoja.1506',
    subject: 'IT Savodxonlik & Grafik Dizayn',
    phone: '+998901234567',
    adminScore: 100,
    adminFeedback: "Asosiy IT va Grafik dizayn o'qituvchisi",
    createdAt: '2026-10-19T00:00:00.000Z',
  },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const DISK_FILE = path.join(DATA_DIR, 'global-portal-db.json');

interface StoreMemory {
  students: Map<string, any>;
  grades: Map<string, any>;
  ratings: Map<string, any>;
  homeworks: Map<string, any>;
  submissions: Map<string, any>;
  smartCoins: Map<string, any>;
  teachers: Map<string, any>;
  teacherEvaluations: Map<string, any>;
  smsLogs: Map<string, any>;
  meta: Map<string, any>;
}

const memoryStore: StoreMemory = {
  students: new Map(),
  grades: new Map(),
  ratings: new Map(),
  homeworks: new Map(),
  submissions: new Map(),
  smartCoins: new Map(),
  teachers: new Map(),
  teacherEvaluations: new Map(),
  smsLogs: new Map(),
  meta: new Map(),
};

function sanitizeDocId(id: string): string {
  return String(id || 'item')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120);
}

function loadFromDisk() {
  try {
    if (fs.existsSync(DISK_FILE)) {
      const raw = fs.readFileSync(DISK_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      (Object.keys(COLLECTION_MAP) as GlobalCollectionKey[]).forEach((key) => {
        if (Array.isArray(parsed[key])) {
          parsed[key].forEach((item: any) => {
            if (item && item.id) {
              memoryStore[key].set(String(item.id), item);
            }
          });
        }
      });
    }
  } catch (err) {
    console.warn('GlobalStore disk read fallback:', err);
  }
}

let diskSaveTimeout: ReturnType<typeof setTimeout> | null = null;
function scheduleSaveToDisk() {
  if (diskSaveTimeout) clearTimeout(diskSaveTimeout);
  diskSaveTimeout = setTimeout(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const snapshot: Record<string, any[]> = {};
      (Object.keys(COLLECTION_MAP) as GlobalCollectionKey[]).forEach((key) => {
        snapshot[key] = Array.from(memoryStore[key].values());
      });
      fs.writeFileSync(DISK_FILE, JSON.stringify(snapshot, null, 2), 'utf-8');
    } catch (err) {
      console.warn('GlobalStore disk save error:', err);
    }
  }, 150);
}

async function writeToCloudFirestore(key: GlobalCollectionKey, item: any) {
  try {
    const colName = COLLECTION_MAP[key];
    const docId = sanitizeDocId(item.id);
    const serialized = JSON.stringify(item);
    if (serialized.length > 890000) {
      return;
    }
    await setDoc(doc(fdb, colName, docId), {
      id: docId,
      payload: serialized,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(`Cloud Firestore write warning [${key}]:`, (err as Error)?.message);
  }
}

async function removeFromCloudFirestore(key: GlobalCollectionKey, id: string) {
  try {
    const colName = COLLECTION_MAP[key];
    const docId = sanitizeDocId(id);
    await deleteDoc(doc(fdb, colName, docId));
  } catch (err) {
    console.warn(`Cloud Firestore delete warning [${key}]:`, (err as Error)?.message);
  }
}

let isHydrated = false;
let hydrationPromise: Promise<void> | null = null;

export async function initGlobalStore(): Promise<void> {
  if (isHydrated) return;
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    loadFromDisk();

    const keys = Object.keys(COLLECTION_MAP) as GlobalCollectionKey[];
    await Promise.all(
      keys.map(async (key) => {
        const colName = COLLECTION_MAP[key];
        try {
          const snap = await getDocs(collection(fdb, colName));
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && typeof data.payload === 'string') {
              try {
                const parsed = JSON.parse(data.payload);
                if (parsed && parsed.id) {
                  memoryStore[key].set(String(parsed.id), parsed);
                }
              } catch {
                // Ignore malformed payload
              }
            }
          });
        } catch (err) {
          console.warn(`Initial Firestore fetch warning [${colName}]:`, (err as Error)?.message);
        }
      })
    );

    // Ensure all 12 default students exist in the global store
    for (const defSt of DEFAULT_STUDENTS) {
      const existsByLogin = Array.from(memoryStore.students.values()).some(
        (s) => String(s.login || '').toLowerCase() === defSt.login.toLowerCase()
      );
      if (!existsByLogin && !memoryStore.students.has(defSt.id)) {
        memoryStore.students.set(defSt.id, defSt);
        writeToCloudFirestore('students', defSt);
      }
    }

    // Ensure default teacher exists in the global store
    for (const defTch of DEFAULT_TEACHERS) {
      const existsByLogin = Array.from(memoryStore.teachers.values()).some(
        (t) => String(t.login || '').toLowerCase() === defTch.login.toLowerCase()
      );
      if (!existsByLogin && !memoryStore.teachers.has(defTch.id)) {
        memoryStore.teachers.set(defTch.id, defTch);
        writeToCloudFirestore('teachers', defTch);
      }
    }

    scheduleSaveToDisk();

    // Attach real-time Firestore listeners so multiple server instances stay synced
    keys.forEach((key) => {
      const colName = COLLECTION_MAP[key];
      try {
        onSnapshot(
          collection(fdb, colName),
          (snap) => {
            let changed = false;
            snap.docChanges().forEach((change) => {
              if (change.type === 'removed') {
                const docData = change.doc.data();
                if (docData && typeof docData.payload === 'string') {
                  try {
                    const parsed = JSON.parse(docData.payload);
                    if (parsed?.id && memoryStore[key].has(String(parsed.id))) {
                      memoryStore[key].delete(String(parsed.id));
                      changed = true;
                    }
                  } catch {
                    // ignore
                  }
                }
              } else {
                const docData = change.doc.data();
                if (docData && typeof docData.payload === 'string') {
                  try {
                    const parsed = JSON.parse(docData.payload);
                    if (parsed && parsed.id) {
                      memoryStore[key].set(String(parsed.id), parsed);
                      changed = true;
                    }
                  } catch {
                    // ignore
                  }
                }
              }
            });
            if (changed) {
              scheduleSaveToDisk();
            }
          },
          () => {
            // Ignore snapshot stream errors
          }
        );
      } catch {
        // Ignore
      }
    });

    isHydrated = true;
  })();

  return hydrationPromise;
}

export function getGlobalList<T = any>(key: GlobalCollectionKey): T[] {
  return Array.from(memoryStore[key].values()) as T[];
}

export function getGlobalItem<T = any>(key: GlobalCollectionKey, id: string): T | null {
  return (memoryStore[key].get(String(id)) as T) || null;
}

export async function upsertGlobalItem<T extends { id: string }>(
  key: GlobalCollectionKey,
  item: T
): Promise<T> {
  const id = String(item.id);
  const existing = memoryStore[key].get(id) || {};
  const merged = { ...existing, ...item, id };
  memoryStore[key].set(id, merged);
  scheduleSaveToDisk();
  await writeToCloudFirestore(key, merged);
  return merged;
}

export async function deleteGlobalItem(key: GlobalCollectionKey, id: string): Promise<boolean> {
  const cleanId = String(id);
  const existed = memoryStore[key].delete(cleanId);
  scheduleSaveToDisk();
  await removeFromCloudFirestore(key, cleanId);
  return existed;
}

export async function clearGlobalCollection(key: GlobalCollectionKey): Promise<void> {
  const ids = Array.from(memoryStore[key].keys());
  memoryStore[key].clear();
  scheduleSaveToDisk();
  await Promise.all(ids.map((id) => removeFromCloudFirestore(key, id)));
}
