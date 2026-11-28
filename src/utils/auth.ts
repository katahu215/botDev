import { createSignal } from "solid-js";
import { unwrap } from "solid-js/store";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { modalService } from "../UI/Component/modalService";
import AuthorizationMenu from "../UI/Menu/AuthorizationMenu";
import defaultMonsters from "../data/monster_all.json";
import { defaultSettings, setSessionStore, setMonstersStore, setSettingsStore } from "./store";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNqgFGCCIZpcEzz34pl1-cXZQvzcC-DlI",
  authDomain: "leaguebot-f4e45.firebaseapp.com",
  projectId: "leaguebot-f4e45",
  storageBucket: "leaguebot-f4e45.firebasestorage.app",
  messagingSenderId: "300455717677",
  appId: "1:300455717677:web:c597085143f9d7d93f01a4",
  measurementId: "G-9HLZ60C8H9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const [isAuthorized, setIsAuthorized] = createSignal(Boolean(auth.currentUser));

let syncedUid: string | null = null;
let inflightSync: { uid: string; promise: Promise<void> } | null = null;
let isRegistering = false;

const normalizeUsername = (name: string) => name.trim().toLowerCase();
const toSyntheticEmail = (normalizedName: string) => `${normalizedName}@users.local`;

const mergeMonsters = (userMonsters: Record<string, any> | undefined | null) => {
  const defaults = defaultMonsters as Record<string, any>;
  const merged: Record<string, any> = { ...(userMonsters ?? {}) };
  let hasMissing = false;

  for (const id of Object.keys(defaults)) {
    if (merged[id] === undefined) {
      merged[id] = { ...defaults[id] };
      hasMissing = true;
    }
  }

  return { merged, hasMissing };
};
const mergeSettings = (userSettings: Record<string, any> | undefined | null) => {
  const defaults = defaultSettings as Record<string, any>;
  const merged: Record<string, any> = {};
  let hasMissing = false;
  let hasExtra = false;

  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (userSettings?.[key] !== undefined) {
      merged[key] = userSettings[key];
    } else {
      merged[key] = defaultValue;
      hasMissing = true;
    }
  }

  for (const key of Object.keys(userSettings ?? {})) {
    if (defaults[key] === undefined) {
      hasExtra = true;
      break;
    }
  }

  return { merged, hasMissing, hasExtra };
};

const syncData = async (uid: string, record: any) => {
  if (record.setting) {
    const { merged, hasMissing, hasExtra } = mergeSettings(record.setting);

    setSessionStore("permissions", {
      isVip: Boolean(record.is_vip),
      isAdmin: Boolean(record.is_admin),
    });
    setSettingsStore(merged as any);

    if (hasMissing || hasExtra) {
      updateDoc(doc(db, "users", uid), {
        setting: unwrap(merged),
      }).catch((err) => console.error("Не удалось синхронизировать настройки с базой:", err));
    }
  }

  if (record.monster) {
    const { merged, hasMissing } = mergeMonsters(record.monster);
    setMonstersStore(merged);

    if (hasMissing) {
      updateDoc(doc(db, "users", uid), {
        monster: unwrap(merged),
      }).catch((err) => console.error("Не удалось синхронизировать монстров с базой:", err));
    }
  } else {
    setMonstersStore(defaultMonsters);
    updateDoc(doc(db, "users", uid), {
      monster: defaultMonsters,
    }).catch((err) => console.error("Не удалось синхронизировать монстров с базой:", err));
  }
};

const ensureUserSynced = (uid: string, preloadedData?: any): Promise<void> => {
  if (!preloadedData && syncedUid === uid) {
    return Promise.resolve();
  }

  if (inflightSync && inflightSync.uid === uid) {
    return inflightSync.promise;
  }

  const run = async () => {
    try {
      const data = preloadedData ?? (await getDoc(doc(db, "users", uid))).data();
      if (!data) {
        syncedUid = null;
        await signOut(auth);
        return;
      }

      await syncData(uid, data);
      syncedUid = uid;
    } catch {
      syncedUid = null;
      await signOut(auth);
    } finally {
      if (inflightSync?.uid === uid) {
        inflightSync = null;
      }
    }
  };

  const promise = run();
  inflightSync = { uid, promise };
  return promise;
};

onAuthStateChanged(auth, (user: User | null) => {
  const valid = Boolean(user);
  setIsAuthorized(valid);

  if (isRegistering) return;

  if (user) {
    void ensureUserSynced(user.uid);
  } else {
    syncedUid = null;
    inflightSync = null;
    modalService.open(AuthorizationMenu, { freeze: true });
  }
});

export async function validateSession() {
  await auth.authStateReady();

  if (isRegistering) return;

  const currentUser = auth.currentUser;
  if (!currentUser) {
    syncedUid = null;
    modalService.open(AuthorizationMenu, { freeze: true });
    return;
  }

  await ensureUserSynced(currentUser.uid);
  if (auth.currentUser) {
    setIsAuthorized(true);
    modalService.closeLast(true);
  }
}

export const loginUser = async (name: string, pass: string) => {
  try {
    const key = normalizeUsername(name);
    if (!key) {
      return { success: false, error: "Неверное имя или пароль" };
    }

    const email = toSyntheticEmail(key);
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await ensureUserSynced(cred.user.uid);

    setIsAuthorized(true);
    modalService.closeLast(true);
    return { success: true };
  } catch {
    return { success: false, error: "Неверное имя или пароль" };
  }
};

export const registerUser = async (name: string, pass: string) => {
  isRegistering = true;
  try {
    const cleanName = name.trim();
    const key = normalizeUsername(cleanName);
    if (!key) {
      return { success: false, error: "Введите корректное имя." };
    }

    const usernameRef = doc(db, "usernames", key);
    const existing = await getDoc(usernameRef);
    if (existing.exists()) {
      return { success: false, error: "Не удалось зарегистрироваться. Возможно, имя занято." };
    }

    const email = toSyntheticEmail(key);
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    const initialUserDoc = {
      name: cleanName,
      setting: defaultSettings,
      monster: defaultMonsters,
      is_vip: false,
      is_admin: false,
      createdAt: Date.now(),
    };

    await setDoc(doc(db, "users", uid), initialUserDoc);
    await setDoc(usernameRef, {
      email,
      uid,
      name: cleanName,
    });

    await ensureUserSynced(uid, initialUserDoc);
    setIsAuthorized(true);
    modalService.closeLast(true);
    return { success: true };
  } catch {
    if (auth.currentUser) {
      await signOut(auth).catch(() => {});
    }
    syncedUid = null;
    return { success: false, error: "Не удалось зарегистрироваться. Возможно, имя занято." };
  } finally {
    isRegistering = false;
  }
};
