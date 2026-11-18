// 8 - горение - блуждайки
//12паралич -оцепа,электрошок,парализующая пыльца
// 13- заражение - пиявки
//15сон - колыбель, споры гипноз, сонная пыльца,свирель
//9 спутан - путы
//56 насмешка
// 13 - отравлен

import { runHeal } from "../game/Heal";
import { Swap } from "../game/Swap";
import { findAttack } from "../utils/findAttack";
import { log } from "../utils/logger";
import { toggleTeam } from "../utils/openTeam";
import { delay, delayAttack, delayInterface } from "../utils/sleep";
import { optionsRadioGroup, sessionStore, setSessionStore, settingsStore } from "../utils/store";
import { ActionClick } from "../utils/useClick";
import { waitForResponse } from "../utils/websocket";
import { Attack } from "./Attack";

const STATUS_MAP: Record<number, number> = { 1: 15, 2: 15, 3: 15, 4: 15, 5: 15, 6: 12, 7: 12, 8: 12, 9: 9, 10: 56 }; // ключ, значение

interface catchOption {
  ball: number;
  useTaunt?: boolean;
}

let countTaunt = 0;

export const Catch = async ({ ball, useTaunt }: catchOption) => {
  if (settingsStore.catchMonster && sessionStore.iPoke.id !== Number(settingsStore.catchMonster)) {
    const swap = await Swap(settingsStore.catchMonster);
    if (!swap) return;
  }

  if (useTaunt) countTaunt = 0;

  await toggleMonsterTeam();

  const wSkill = optionsRadioGroup.skillWeather.find((i) => i.value === settingsStore.skillWeather)?.label || "";
  const cSkill = optionsRadioGroup.skillCatch.find((i) => i.value === settingsStore.skillCatch)?.label || "";
  const sSkill = optionsRadioGroup.skillStatus.find((i) => i.value === settingsStore.skillStatus)?.label || "";

  const results: Record<string, any> = {};

  for (let i = 0; i < 5; i++) {
    if (useTaunt) {
      results.taunt = await runStep({ skill: "Насмешка", isStatus: true, useTaunt });
      if (!results.taunt.reaction) break;
    }
    if (settingsStore.skillWeather) {
      results.weather = await runStep({ skill: wSkill, isWeather: true, useTaunt });
      if (!results.weather.reaction) break;
    }
    results.catch = await runStep({ skill: cSkill, useTaunt });
    if (!results.catch.reaction) break;
    if (settingsStore.skillStatus) {
      results.status = await runStep({ skill: sSkill, isStatus: true, useTaunt });
      if (!results.status.reaction) break;
    }
    if (!(await useBall(ball)) || sessionStore.isEnded) break;
  }

  for (const result of Object.values(results)) {
    if (result?.notFound) return log("Нет нужной атаки.");
    if (result?.attack?.back) return Attack({ targetAttack: result.attack.num, isHeal: true });
    if (result?.attack?.pp - 1 <= settingsStore.limitPp) return runHeal();
    // if (!result.attack) return console.log("хз как тут не оказалось вообще атаки");
  }

  //  если  бой окончен и проверки выполнены
  setSessionStore("monstersTeam", "count", (prevCount) => prevCount + 1);
  await toggleMonsterTeam();

  if (cSkill === "Блуждающие огни" || cSkill === "Семена-пиявки") return runHeal();
};

interface StepOptions {
  skill: string;
  isWeather?: boolean;
  isStatus?: boolean;
  useTaunt?: boolean;
}
const runStep = async ({ skill, isWeather, isStatus, useTaunt }: StepOptions) => {
  let attack = null;
  for (let i = 0; i < 15; i++) {
    if (!isStatus && (sessionStore.hPoke.hp / sessionStore.hPoke.hp_max) * 100 <= settingsStore.limitHp) break;
    if (isWeather && sessionStore.fightData.weather?.[0] === settingsStore.skillWeather) break;
    if (isStatus) {
      const status = useTaunt ? 10 : settingsStore.skillStatus;
      if (sessionStore.hPoke.status[STATUS_MAP[status]]) break;
    }

    await delayAttack();

    const needTaunt = useTaunt && countTaunt === 2;
    const targetSkill = needTaunt ? "Насмешка" : skill;

    attack = findAttack(targetSkill);
    if (attack?.notFound) return { attack, notFound: true, reaction: false };
    if (!attack || attack.back) return { attack, notFound: false, reaction: false };

    const waiter = waitForResponse("/do/fight/attack");
    await ActionClick.handleClickAttack(attack.num);
    await waiter;

    if (useTaunt) {
      if (needTaunt) {
        countTaunt = 0; // Сбросили, так как ударили Насмешкой
      } else {
        countTaunt++; // Увеличили, так как сделали обычный ход
      }
    }

    if (sessionStore.isEnded) break;
  }

  if (sessionStore.isEnded) return { attack, notFound: false, reaction: false };

  return { attack, notFound: false, reaction: true };
};

export const useBall = async (ball: number): Promise<boolean> => {
  await delay(2200, 1800);

  let waiter = waitForResponse("/do/pokes/load/list");
  await ActionClick.handleClick({ selector: "#divFightI .ball.clickable" });
  await waiter;
  await delayInterface();

  waiter = waitForResponse("/do/items/fightlist");
  await ActionClick.handleContextClick({ searchText: "Использовать предмет" });
  const result: any = await waiter;
  const ballIndex = result.object.items.findIndex((item: any) => item[3] === ball);

  if (ballIndex === -1) return false;

  // тут тоже
  await delayInterface();

  waiter = waitForResponse("/do/fight/useitem");
  await ActionClick.handleClick({ selector: ".hintcontent .divItemFightlist .item.clickable", index: ballIndex });
  await waiter;

  return true;
};
const toggleMonsterTeam = async () => {
  if (!sessionStore.monstersTeam.count) {
    const response = await toggleTeam(true);

    const arrayTemp = response.map((item: any) => item.id);

    setSessionStore("monstersTeam", {
      block: arrayTemp,
      count: response.length,
    });
  }

  if (sessionStore.monstersTeam.count === 6) {
    setSessionStore("isBackMonster", true);
    setSessionStore("monstersTeam", "count", 0);
    return runHeal();
  }
};
