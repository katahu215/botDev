import { createStore, produce } from "solid-js/store";
import autoMonsterIds from "../data/auto_monster.json";
import { pb } from "./auth";

export type Monster = {
  id: number;
  name: string;
  cat: number;
};
interface MonsterTeam {
  block: number[];
  count: number;
}
interface Drops {
  items: Record<string, number>;
  monsters: Record<number, number>;
}
interface ShineSettings {
  catchShine: boolean;
  useSuperBall: boolean;
}

export interface UserSettings {
  attackSkill: number;
  finishSkill: number;
  finishMonster: string;

  lvlUpSkill: number;
  lvlUpMonster: string;
  maxLvl: number;

  skillCatch: number;
  skillWeather: number;
  skillStatus: number;
  catchMonster: string;
  monsterBall: number;
  countCatch: number;
  gender: number[];
  butterfly: number[];
  semant: number[];
  shine: ShineSettings;

  limitHp: number;
  limitPp: number;
  useArenaHeal: boolean;

  //
  alertEnabled: boolean;
  alertStopBot: boolean;

  autoItem: number;
  halloween: any; //object
}

export interface GameSessionState {
  role: Record<string, boolean>;
  isRunning: boolean;
  isMobile: boolean;

  userId: number;
  userName: string;
  location: number;
  monstersTeam: MonsterTeam;
  drops: Drops;
  fightData: any;
  iPoke: any;
  hPoke: any;
  isEnded: number;
  isAgro: boolean;
  isBackMonster: boolean;
  timerItem: any; // object
}

export const win = window as any;

export const [sessionStore, setSessionStore] = createStore<GameSessionState>({
  role: {
    isAdmin: false,
    isDev: false,
  },
  isRunning: false,
  isMobile: false,

  userId: 0,
  userName: "",
  location: 0,
  monstersTeam: {
    block: [],
    count: 0,
  },
  drops: {
    items: {},
    monsters: {},
  },
  fightData: null,
  iPoke: null,
  hPoke: null,
  isEnded: 1,
  isAgro: false,
  isBackMonster: false,
  timerItem: {},
});

export const [settingsStore, setSettingsStore] = createStore<UserSettings>({} as UserSettings);
export const [monstersStore, setMonstersStore] = createStore<Record<string, Monster>>({});

export const defaultSettings: UserSettings = {
  attackSkill: 1,
  finishSkill: 1,
  finishMonster: "",

  //
  lvlUpSkill: 1,
  lvlUpMonster: "", /// null all
  maxLvl: 100,
  //

  skillCatch: 1,
  skillWeather: 0,
  skillStatus: 0,
  catchMonster: "",
  monsterBall: 1,
  countCatch: 5,
  gender: [0],
  butterfly: [0],
  semant: [0],
  shine: {
    catchShine: false,
    useSuperBall: false,
  },

  ///

  limitHp: 25,
  limitPp: 0,
  useArenaHeal: false,

  //
  alertEnabled: false,
  alertStopBot: false,
  //
  autoItem: 145,

  halloween: {
    usePay: true,
    useCandy: true,
  },
};

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

// export const isAdmin = createMemo(() => {
//   if (sessionStore.role) return true;
//   return false;
// });
// export const isSpecial1 = createMemo(() => {
//   if (sessionStore.isDev || sessionStore.isAdmin) return true;
//   return false;
// });

export const appService = {
  updateMonster: async (id: number, newCat: number) => {
    setMonstersStore(String(id), "cat", newCat);

    const userId = pb.authStore.record?.id;
    if (!userId) return;

    try {
      const plainMonsters = JSON.parse(JSON.stringify(monstersStore));

      const updatedRecord = await pb.collection("users").update(userId, {
        monster: plainMonsters,
      });

      if (updatedRecord.monster) {
        setMonstersStore(updatedRecord.monster);
      }
    } catch (err: any) {
      console.error("❌ Ошибка при сохранении монстра:", err?.response || err);
    }
  },

  updateAllMonster: async (reset: boolean) => {
    setMonstersStore(
      produce((store) => {
        if (reset) {
          for (const key of Object.keys(store)) {
            store[key].cat = 1;
          }
        } else {
          for (const id of autoMonsterIds) {
            const stringId = String(id);
            if (store[stringId]) {
              store[stringId].cat = 2;
            }
          }
        }
      }),
    );

    const userId = pb.authStore.record?.id;
    if (!userId) return;

    try {
      const plainMonsters = JSON.parse(JSON.stringify(monstersStore));

      const updatedRecord = await pb.collection("users").update(userId, {
        monster: plainMonsters,
      });

      if (updatedRecord.monster) setMonstersStore(updatedRecord.monster);
    } catch (err: any) {
      console.error("❌ Ошибка при массовом обновлении:", err?.response || err);
    }
  },

  updateSettings: async <K extends keyof UserSettings>(name: K, value: UserSettings[K] | Partial<UserSettings[K]>) => {
    // Проверяем: если это объект (например, shine), мерджим со старым состоянием
    if (value && typeof value === "object" && !Array.isArray(value)) {
      setSettingsStore(name, (prev: any) => ({ ...prev, ...value }));
    } else {
      setSettingsStore(name, value as any);
    }

    const userId = pb.authStore.record?.id;
    if (!userId) return;

    try {
      const plainSettings = JSON.parse(JSON.stringify(settingsStore));
      await pb.collection("users").update(userId, { setting: plainSettings });
    } catch (err: any) {
      console.error("❌ Ошибка сохранения настроек:", err?.response || err);
    }
  },
};
