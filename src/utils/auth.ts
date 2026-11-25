import { createSignal } from "solid-js";
import PocketBase from "pocketbase";
import { modalService } from "../UI/Component/modalService";
import AuthorizationMenu from "../UI/Menu/AuthorizationMenu";
import defaultMonsters from "../data/monster_all.json";
import { defaultSettings, setSessionStore } from "./store";
import { setMonstersStore, setSettingsStore } from "./store";

export const pb = new PocketBase("https://pbhelperskatan.duckdns.org:8443/");

export const [isAuthorized, setIsAuthorized] = createSignal(pb.authStore.isValid);

pb.authStore.onChange((_token, model) => {
  setIsAuthorized(pb.authStore.isValid);

  if (pb.authStore.isValid && model) {
    syncData(model);
  } else {
    modalService.open(AuthorizationMenu, { freeze: true });
  }
});

export async function validateSession() {
  if (!pb.authStore.isValid || !pb.authStore.record) return modalService.open(AuthorizationMenu, { freeze: true });

  try {
    const userRecord = await pb.collection("users").getOne(pb.authStore.record.id);

    syncData(userRecord);
  } catch (err) {
    pb.authStore.clear();
  }
}

export const loginUser = async (name: string, pass: string) => {
  try {
    const authData = await pb.collection("users").authWithPassword(name, pass);
    syncData(authData);
    modalService.closeLast(true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Неверное имя или пароль" };
  }
};

export const registerUser = async (name: string, pass: string) => {
  try {
    const data = {
      name: name,
      password: pass,
      passwordConfirm: pass,
      setting: defaultSettings,
      monster: defaultMonsters,
    };

    await pb.collection("users").create(data);
    const authData = await pb.collection("users").authWithPassword(name, pass);

    syncData(authData);

    modalService.closeLast(true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Не удалось зарегистрироваться. Возможно, имя занято." };
  }
};

const syncData = (record: any) => {
  if (record.setting) {
    const userSettings = record.setting;
    const defaultKeys = Object.keys(defaultSettings);

    const mergedSettings = Object.fromEntries(defaultKeys.map((key) => [key, userSettings[key] !== undefined ? userSettings[key] : (defaultSettings as any)[key]]));

    setSessionStore("permissions", {
      isVip: record.is_vip,
      isAdmin: record.is_admin,
    });
    setSettingsStore(mergedSettings);

    const hasMissingFields = defaultKeys.some((key) => userSettings[key] === undefined);
    const hasExtraFields = Object.keys(userSettings).some((key) => (defaultSettings as any)[key] === undefined);

    if ((hasMissingFields || hasExtraFields) && pb.authStore.record) {
      pb.collection("users")
        .update(pb.authStore.record.id, { setting: mergedSettings })
        .catch((err) => console.error("Не удалось синхронизировать настройки с базой:", err));
    }
  }

  if (record.monster) {
    setMonstersStore(record.monster);
  }
};
