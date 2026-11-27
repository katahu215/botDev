import { createStore, produce, unwrap } from "solid-js/store";
import autoMonsterIds from "../data/auto_monster.json";
import type { GameSessionState, Monster, UserSettings } from "../types";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./auth";

export const win = window as any;

export const defaultSettings: UserSettings = {
  isDarkTheme: false,

  battle: {
    attackSkillId: 1,
    finishSkillId: 1,
    finishTargetMonsterId: 0,
  },

  leveling: {
    skillId: 1,
    targetMonsterId: 0,
    maxLevel: 100,
  },

  catch: {
    skillId: 1,
    weatherSkillId: 0,
    statusSkillId: 0,
    targetMonsterId: 0,
    ballId: 1,
    genderFilter: [0],
    butterflyFilter: [0],
    semantFilter: [0],
    shine: {
      isEnabled: false,
      useSuperBall: false,
    },
  },

  survival: {
    minHpPercent: 25,
    minPpPercent: 0,
    useArenaHeal: false,
  },

  alerts: {
    isEnabled: true,
    isStopBotOnAlert: true,
  },

  automation: {
    autoItemId: 145,
    shutdownDelayMin: 1,
  },

  halloween: {
    usePay: true,
    useCandy: true,
  },
};

export const [sessionStore, setSessionStore] = createStore<GameSessionState>({
  isEnabled: false,
  isMobile: false,

  userId: 0,
  userName: "",
  permissions: {
    isAdmin: false,
    isVip: false,
  },
  locationId: 0,

  monstersTeam: {
    blockedMonsterIds: [],
    totalCount: 0,
  },
  drops: {
    items: {},
    monsters: {},
  },

  battleState: null,
  activeMonster: null,
  opponentMonster: null,

  isBattleFinished: true,
  isAgroLocation: false,
  isGiveMonsters: false,
  itemCooldown: 3600,
});
export const [settingsStore, setSettingsStore] = createStore<UserSettings>(defaultSettings);

export const [monstersStore, setMonstersStore] = createStore<Record<string, Monster>>({});

export interface RadioOption {
  value: number;
  label: string;
}
export const optionsRadioGroup: Record<string, RadioOption[]> = {
  attackSkill: [
    { value: 1, label: "Атака 1" },
    { value: 2, label: "Атака 2" },
    { value: 3, label: "Атака 3" },
    { value: 4, label: "Атака 4" },
    { value: 100, label: "Все" },
  ],
  finishSkill: [
    { value: 1, label: "Атака 1" },
    { value: 2, label: "Атака 2" },
    { value: 3, label: "Атака 3" },
    { value: 4, label: "Атака 4" },
  ],
  lvlUpSkill: [
    { value: 1, label: "Крик банши" },
    { value: 2, label: "Замедленная бомба" },
  ],
  skillWeather: [
    { value: 1, label: "Танец дождя" },
    { value: 2, label: "Ясный день" },
    { value: 0, label: "Не использовать" },
  ],
  skillCatch: [
    { value: 1, label: "Сломанный меч" },
    { value: 2, label: "Блуждающие огни" },
    { value: 3, label: "Семена-пиявки" },
  ],
  skillStatus: [
    { value: 1, label: "Колыбельная" },
    { value: 2, label: "Споры" },
    { value: 3, label: "Гипноз" },
    { value: 4, label: "Свирель" },
    { value: 5, label: "Сонная пыльца" },
    { value: 6, label: "Парализующая пыльца" },
    { value: 7, label: "Электрошок" },
    { value: 8, label: "Оцепенение" },
    { value: 9, label: "Путы" },
    { value: 10, label: "Насмешка" },
    { value: 0, label: "Не использовать" },
  ],
  weather: [
    { value: 1, label: "Град" },
    { value: 2, label: "Песчаная буря" },
    { value: 3, label: "Град и Песчаная буря" },
    { value: 4, label: "Не использовать" },
  ],
  butterfly: [
    { value: 0, label: "Все" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
  ],
  semant: [
    { value: 0, label: "Все" },
    { value: 1, label: "А" },
    { value: 2, label: "Б" },
    { value: 3, label: "В" },
    { value: 4, label: "Г" },
    { value: 5, label: "Д" },
    { value: 6, label: "Е" },
    { value: 7, label: "Ё" },
    { value: 8, label: "Ж" },
    { value: 9, label: "З" },
    { value: 10, label: "И" },
    { value: 11, label: "Й" },
    { value: 12, label: "К" },
    { value: 13, label: "Л" },
    { value: 14, label: "М" },
    { value: 15, label: "Н" },
    { value: 16, label: "О" },
    { value: 17, label: "П" },
    { value: 18, label: "Р" },
    { value: 19, label: "С" },
    { value: 20, label: "Т" },
    { value: 21, label: "У" },
    { value: 22, label: "Ф" },
    { value: 23, label: "Х" },
    { value: 24, label: "Ц" },
    { value: 25, label: "Ч" },
    { value: 26, label: "Ш" },
    { value: 27, label: "Щ" },
    { value: 28, label: "Ъ" },
    { value: 29, label: "Ы" },
    { value: 30, label: "Ь" },
    { value: 31, label: "Э" },
    { value: 32, label: "Ю" },
    { value: 33, label: "Я" },
  ],
  monsterBall: [
    { value: 1, label: "Монстробол" },
    { value: 2, label: "Гритбол" },
    { value: 3, label: "Мастербол" },
    { value: 4, label: "Ультрабол" },
    { value: 5, label: "Люксбол" },
    { value: 6, label: "Фастбол" },
    { value: 7, label: "Френдбол" },
    { value: 9, label: "Лавбол" },
    { value: 12, label: "Нестбол" },
    { value: 13, label: "Даркбол" },
    { value: 14, label: "Лайтбол" },
    { value: 16, label: "Трансбол" },
    { value: 18, label: "Супердаркбол" },
    { value: 30, label: "Браконьера" },
    { value: 101, label: "Багбол" },
    { value: 102, label: "Блэкбол" },
    { value: 103, label: "Драгонбол" },
    { value: 104, label: "Электробол" },
    { value: 105, label: "Файтбол" },
    { value: 106, label: "Фаербол" },
    { value: 107, label: "Флайбол" },
    { value: 108, label: "Гостбол" },
    { value: 109, label: "Грасбол" },
    { value: 110, label: "Граундбол" },
    { value: 111, label: "Айсбол" },
    { value: 112, label: "Нормобол" },
    { value: 113, label: "Токсикбол" },
    { value: 114, label: "Псибол" },
    { value: 115, label: "Стоунбол" },
    { value: 116, label: "Стилбол" },
    { value: 117, label: "Дайвбол" },
    { value: 118, label: "Фейбол" },
  ],
  items: [
    { value: 145, label: "Старая удочка" },
    { value: 146, label: "Спиннинг" },
    { value: 147, label: "Рыболовные сети" },
    { value: 148, label: "Фото Камелионы" },
    { value: 183, label: "Приманка" },
    { value: 185, label: "Самодельный сканер" },
    { value: 186, label: "Ягодный сок" },
    { value: 235, label: "Свисток" },
    { value: 255, label: "Большой запас воды" },
    { value: 268, label: "Акваланг" },
    { value: 386, label: "Портативный генератор" },
  ],
  gender: [
    { value: 1, label: "Мальчик" },
    { value: 2, label: "Девочка" },
    { value: 3, label: "Бесполый" },
    { value: 0, label: "Все" },
  ],
};

async function saveToDb(data: Record<string, any>, errorLabel: string) {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return;
  }

  try {
    await updateDoc(doc(db, "users", userId), data);
  } catch (err: any) {
    console.error(`❌ ${errorLabel}:`, err?.code || err);
  }
}

type UpdateOptions = { save?: boolean };

async function updateSetting(...args: [...string[], any] | [...string[], any, UpdateOptions]) {
  const last = args[args.length - 1];
  const hasOptions = typeof last === "object" && last !== null && !Array.isArray(last) && "save" in last;

  const save = hasOptions ? Boolean((last as UpdateOptions).save) : true;
  const storeArgs = hasOptions ? args.slice(0, -1) : args;

  if (storeArgs.length < 2) {
    console.error("❌ Недостаточно аргументов для updateSetting:", storeArgs);
    return;
  }

  (setSettingsStore as any)(...storeArgs);

  if (save) {
    await saveToDb({ setting: unwrap(settingsStore) }, "Ошибка сохранения настроек");
  }
}

export const appService = {
  updateMonster(id: number, newCat: number) {
    setMonstersStore(String(id), "cat", newCat);
    return saveToDb({ monster: unwrap(monstersStore) }, "Ошибка при сохранении монстра");
  },

  updateAllMonster(reset: boolean) {
    setMonstersStore(
      produce((store) => {
        if (reset) {
          for (const key of Object.keys(store)) {
            store[key].cat = 1;
          }
          return;
        }

        for (const id of autoMonsterIds) {
          const entry = store[String(id)];
          if (entry) entry.cat = 2;
        }
      }),
    );

    return saveToDb({ monster: unwrap(monstersStore) }, "Ошибка при массовом обновлении");
  },

  setSetting: setSettingsStore,
  updateSetting,
};
