import { toggleTeam } from "./utils/openTeam.ts";
import { delay, delayGo, delayInterface } from "../utils/sleep.ts";
import { sessionStore, setSessionStore, settingsStore } from "../utils/store.js";
import { toggleAutoConfirm } from "./utils/toggleAutoConfirm.ts";
import { waitForResponse } from "../utils/websocket.ts";
import { log } from "../utils/logger.ts";
import { surrender } from "./surrender.ts";
import { toggleSwitch } from "./utils/toggleSwitch.ts";
import { ActionClick } from "./utils/useClick.ts";

interface HealRoutesMap {
  [locationId: number]: {
    [step: number]: number[];
  };
}
const HEAL_ROUTES: HealRoutesMap = {
  // ВД
  22: {
    1: [22, 23, 25],
  },
  18: {
    1: [18, 9, 1, 3],
  },
  19: {
    1: [19, 52, 53],
  },
  31: {
    1: [31, 23, 25],
  },
  156: {
    1: [156, 31, 23, 25],
  },
  14: {
    1: [14, 10, 1, 3],
  },
  148: {
    1: [148, 10, 1, 3],
  },
  7: {
    1: [7, 9, 1, 3],
  },
  450: {
    1: [450, 7, 9, 1, 3],
  },
  17: {
    1: [17, 10, 1, 3],
  },
  59: {
    1: [59, 47, 17, 10, 1, 3],
  },
  776: {
    1: [776, 59, 47, 17, 10, 1, 3],
  },
  779: {
    1: [779, 776, 59, 47, 17, 10, 1, 3],
  },
  16: {
    1: [16, 10, 1, 3],
  },
  32: {
    1: [32, 33, 35],
  },
  42: {
    1: [42, 33, 35],
  },
  43: {
    1: [43, 42, 33, 35],
  },
  41: {
    1: [41, 33, 35],
  },
  45: {
    1: [45, 41, 33, 35],
  },
  158: {
    1: [158, 45, 41, 33, 35],
  },
  159: {
    1: [159, 158, 45, 41, 33, 35],
  },
  // Полицейский участок ВД
  314: {
    1: [314, 9, 1, 3],
  },
  //
  411: {
    1: [411, 459, 346],
  },
  // Старый парк
  341: {
    1: [341, 529, 527, 335],
  },
  // Подвесной мост
  333: {
    1: [333, 529, 527, 335],
  },
  // Гавань
  527: {
    1: [527, 335],
  },
  // Песчаная тропа
  888: {
    1: [888, 527, 335],
  },
  // Коралловая лагуна
  889: {
    1: [889, 888, 527, 335],
  },
  // Мелководье
  332: {
    1: [332, 889, 888, 527, 335],
  },
  // КАНТО
  // Библиотека
  744: {
    1: [744, 160, 213],
  },
  // Электростанция
  182: {
    1: [182, 181, 199],
  },
  // Подсобка
  1118: {
    1: [1118, 1113, 1109, 1108],
  },
  // Маршрут 11
  166: {
    1: [166, 160, 213],
  },
  // Маршрут 6
  161: {
    1: [161, 160, 213],
  },
  // Маршрут 12
  165: {
    1: [165, 164, 209],
  },
  // Маршрут 8
  163: {
    1: [163, 164, 209],
  },
  // Горный тоннель
  183: {
    1: [183, 184, 164, 209],
  },
  // Маршрут 13
  167: {
    1: [167, 165, 164, 209],
  },
  // Маршрут 14
  169: {
    1: [169, 167, 165, 164, 209],
  },
  // Маршрут 15
  170: {
    1: [170, 172, 208],
  },
  // Пирс
  682: {
    1: [682, 644, 172, 208],
  },
  // Маршрут 16
  176: {
    1: [176, 177, 206],
  },
  // Маршрут 19
  174: {
    1: [174, 172, 208],
  },
  // Маршрут 18
  173: {
    1: [173, 172, 208],
  },
  // Пещера Потатов
  168: {
    1: [168, 166, 160, 213],
  },
  // СЕЛЕН
  // Лес Селена
  415: {
    1: [415, 412, 473],
  },
  // Крутой подъём
  448: {
    1: [448, 447, 653],
  },
  // Старая дорога
  499: {
    1: [499, 500, 482, 481, 485],
  },
  // Пастбище
  465: {
    1: [465, 468, 419, 457],
  },
  // Место падения метеорита
  508: {
    1: [508, 507, 506, 414, 412, 473],
  },
  // Лазурная заводь
  489: {
    1: [489, 483, 481, 485],
  },
  // Заброшенное поместье
  501: {
    1: [501, 499, 500, 482, 481, 485],
  },
  // Маршрут 17
  670: {
    1: [670, 479, 439, 461],
  },
  // Грот
  421: {
    1: [421, 420, 419, 457],
  },
  // Маршрут 16
  500: {
    1: [500, 482, 481, 485],
  },
  // Маршрут 18
  507: {
    1: [507, 506, 414, 412, 473],
  },
  // Снежный путь
  506: {
    1: [506, 414, 412, 473],
  },
  // Восточный спуск
  429: {
    1: [429, 427, 431, 434, 436, 419, 457],
  },
  // Провал
  422: {
    1: [422, 418, 419, 457],
  },
  // Пещера основная для кача
  427: {
    1: [427, 431, 434, 436, 419, 457],
    2: [419, 418, 436, 431, 427],
  },
  // Горный водопад
  433: {
    1: [433, 429, 427, 431, 434, 436, 419, 457],
    2: [419, 418, 436, 431, 427, 429, 433],
  },
  // Мыс
  1303: {
    1: [1303, 671, 670, 479, 439, 461],
  },
  //
  // ЗД
  574: {
    1: [574, 566, 567],
  },
  // ручей
  720: {
    1: [720, 574, 566, 567],
  },
  // каменка
  721: {
    1: [721, 720, 574, 566, 567],
  },
  // рукотворка
  722: {
    1: [722, 721, 720, 574, 566, 567],
  },
};

export const heal = async () => {
  await toggleSwitch(false);

  if (settingsStore.survival.useArenaHeal) return teleportArea("Арена Лиги Чемпионов");

  const route = HEAL_ROUTES[sessionStore.locationId];

  if (!route) {
    if (document.querySelector(".btnLocHeal")) return await healLocation();

    return log("Маршрут отсутствует. Сообщите локацию для добавления.");
  }

  //

  if (!sessionStore.isBattleFinished && !(await surrender())) return false;
  await delayGo();

  for (let i = 1; route[1].length > i; i++) await clickGo(route[1][i]);

  await healLocation();

  if (route[2]) {
    for (let i = 0; route[2].length > i; i++) await clickGo(route[2][i]);
  } else {
    for (let i = route[1].length - 2; i >= 0; i--) await clickGo(route[1][i]);
  }

  await toggleSwitch(true);
};

const teleportArea = async (target: string): Promise<boolean | void> => {
  if (target === "Арена Лиги Чемпионов") toggleAutoConfirm("Вы будете перенесены на локацию - Арена Лиги Чемпионов");
  if (target === "Возврат на локацию") toggleAutoConfirm("Вы хотите вернуться на локацию, из которой вы переместились на арену?");

  for (let i = 0; i < 3; i++) {
    await delayGo();

    if (sessionStore.isMobile) {
      if (!document.querySelector("#divDock")?.classList.contains("active")) {
        await ActionClick.handleClick({ selector: "#divDock .btnDockDevice", mobileDocker: true });
        await delayInterface();
      }
    }

    let wait = waitForResponse("/do/diary");
    if (document.querySelectorAll(".divDockIn .icon")[6].classList.contains("active")) {
      await ActionClick.handleClick({ selector: ".divDockIn .dockitem", index: 6, mobileDocker: true });
      await delayInterface();
    }
    await ActionClick.handleClick({ selector: ".divDockIn .dockitem", index: 6, mobileDocker: true });
    await wait;

    wait = waitForResponse("/do/diary/tournaments/load");
    await ActionClick.handleClick({ selector: ".panel.paneldiary .tabControls div", index: 4, mobileDocker: true });
    await wait;

    await delayGo();

    await ActionClick.handleClick({ selector: ".panel.paneldiary .tabContent.tournaments .btnTelep", mobileDocker: true });

    wait = waitForResponse("/do/loc/teleparena");

    await delayGo();

    await ActionClick.handleContextClick({ searchText: `${target}`, mobileDocker: true });
    const result = await wait;

    if (result.code === 400 && !(await surrender())) {
      toggleAutoConfirm();
      return false;
    }
    if (result.code === 500) break;
  }

  if (target === "Арена Лиги Чемпионов") return healingArea();

  await toggleSwitch(true);
  toggleAutoConfirm();
};
const healingArea = async () => {
  if (sessionStore.isGiveMonsters) {
    await backMonster();
    setSessionStore("isGiveMonsters", false);
  }

  await delayInterface();

  let wait = waitForResponse("/do/pc/heal/poke");

  if (!sessionStore.isMobile) {
    await ActionClick.handleHotkey(100);
    await wait;

    await delayGo();

    return teleportArea("Возврат на локацию");
  }

  await ActionClick.handleClick({ selector: ".divCompetePanel .button.justicon:has(span.icon-more)" });

  await delayGo();

  wait = waitForResponse("/do/pc/heal/load");
  await ActionClick.handleContextClick({ searchText: "Лечение монстров" });
  const result = await wait;
  if (result.code === 400) return teleportArea("Возврат на локацию");

  await delayGo();

  wait = waitForResponse("/do/pc/heal/poke");
  await ActionClick.handleContextClick({ searchText: "Лечить всех" });
  await wait;

  teleportArea("Возврат на локацию");
  return;
};

const backMonster = async () => {
  const result = await toggleTeam();

  for (let i = 0; i < result.length; i++) {
    const monster = result[i];
    if (sessionStore.monstersTeam.blockedMonsterIds.includes(monster.id)) continue;

    let waiter = waitForResponse("/do/pc/farm/poke");
    await ActionClick.handleClick({ selector: `.divPokeTeam .poke[data-p-id="${monster.id}"] .maincardContainer .title .button.justicon` });
    await waiter;
    await delay(1000, 700);
  }

  /// закрыть
  await ActionClick.handleClick({ selector: ".divDockIn .dockitem", index: 1 });
};

//
const clickGo = async (index: number) => {
  while (true) {
    const wait = waitForResponse("/do/loc/go");
    await ActionClick.handleClick({ selector: `#btnGo${index}` });
    const response = await wait;

    if (response?.code === 400) {
      await surrender();
      continue;
    }
    break;
  }
  await delayGo();
};

const healLocation = async () => {
  await delayInterface();

  let wait = null;
  let result = null;

  if (sessionStore.isGiveMonsters) {
    await backMonster();
    setSessionStore("isGiveMonsters", false);
  }

  if (!sessionStore.isMobile) {
    wait = waitForResponse("/do/pc/heal/poke");
    await ActionClick.handleHotkey(100);
    result = await wait;
  } else {
    wait = waitForResponse("/do/pc/heal/load");
    await ActionClick.handleClick({ selector: "#divLocNpc .btnLocHeal" });
    result = await wait;
    if (result.code !== 400) {
      /// пауза перед кликом на хил
      await delayGo();

      wait = waitForResponse("/do/pc/heal/poke");
      await ActionClick.handleContextClick({ searchText: "Лечить всех" });
      await wait;
    }
  }
};
