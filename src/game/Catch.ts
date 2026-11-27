// 8 - горение - блуждайки
//12паралич -оцепа,электрошок,парализующая пыльца
// 13- заражение - пиявки
//15сон - колыбель, споры гипноз, сонная пыльца,свирель
//9 спутан - путы
//56 насмешка
// 13 - отравлен

import { heal } from "./heal";
import { swap } from "./swap";
import { findAttack } from "./utils/findAttack";
import { log } from "../utils/logger";
import { toggleTeam } from "./utils/openTeam";
import { delay, delayAttack, delayInterface } from "../utils/sleep";
import { optionsRadioGroup, sessionStore, setSessionStore, settingsStore } from "../utils/store";
import { waitForResponse } from "../utils/websocket";
import { Attack } from "./Attack";
import { ActionClick } from "./utils/useClick";

const STATUS_MAP: Record<number, number> = { 1: 15, 2: 15, 3: 15, 4: 15, 5: 15, 6: 12, 7: 12, 8: 12, 9: 9, 10: 56 }; // ключ, значение

interface catchOption {
  ball: number;
  useTaunt?: boolean;
}

let countTaunt = 0;

export const catchAttack = async ({ ball, useTaunt }: catchOption) => {
  if (settingsStore.catch.targetMonsterId && sessionStore.activeMonster.id !== settingsStore.catch.targetMonsterId) {
    const swapMonster = await swap(settingsStore.catch.targetMonsterId);
    if (!swapMonster) return;
  }

  if (useTaunt) countTaunt = 0;

  await toggleMonsterTeam();

  const wSkill = optionsRadioGroup.skillWeather.find((i) => i.value === settingsStore.catch.weatherSkillId)?.label || "";
  const cSkill = optionsRadioGroup.skillCatch.find((i) => i.value === settingsStore.catch.skillId)?.label || "";
  const sSkill = optionsRadioGroup.skillStatus.find((i) => i.value === settingsStore.catch.statusSkillId)?.label || "";

  const results: Record<string, any> = {};

  for (let i = 0; i < 5; i++) {
    if (useTaunt) {
      results.taunt = await runStep({ skill: "Насмешка", isStatus: true, useTaunt });
      if (!results.taunt.reaction) break;
    }
    if (settingsStore.catch.weatherSkillId) {
      results.weather = await runStep({ skill: wSkill, isWeather: true, useTaunt });
      if (!results.weather.reaction) break;
    }
    results.catch = await runStep({ skill: cSkill, useTaunt });
    if (!results.catch.reaction) break;
    if (settingsStore.catch.statusSkillId) {
      results.status = await runStep({ skill: sSkill, isStatus: true, useTaunt });
      if (!results.status.reaction) break;
    }
    if (!(await useBall(ball)) || sessionStore.isBattleFinished) break;
  }

  for (const result of Object.values(results)) {
    if (result?.notFound) return log("Нет нужной атаки.");
    if (result?.attack?.back) return Attack({ targetAttack: result.attack.num, isHeal: true });
    if (result?.attack?.pp - 1 <= settingsStore.survival.minPpPercent) return heal();
    // if (!result.attack) return console.log("хз как тут не оказалось вообще атаки");
  }

  //  если  бой окончен и проверки выполнены
  setSessionStore("monstersTeam", "totalCount", (prevCount) => prevCount + 1);
  await toggleMonsterTeam();

  if (cSkill === "Блуждающие огни" || cSkill === "Семена-пиявки") return heal();
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
    if (!isStatus && (sessionStore.opponentMonster.hp / sessionStore.opponentMonster.hp_max) * 100 <= settingsStore.survival.minHpPercent) break;
    if (isWeather && sessionStore.battleState.weather?.[0] === settingsStore.catch.weatherSkillId) break;
    if (isStatus) {
      const status = useTaunt ? 10 : settingsStore.catch.statusSkillId;
      if (sessionStore.opponentMonster.status[STATUS_MAP[status]]) break;
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

    if (sessionStore.isBattleFinished) break;
  }

  if (sessionStore.isBattleFinished) return { attack, notFound: false, reaction: false };

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
  if (!sessionStore.monstersTeam.totalCount) {
    const response = await toggleTeam(true);

    const arrayTemp = response.map((item: any) => item.id);

    setSessionStore("monstersTeam", {
      blockedMonsterIds: arrayTemp,
      totalCount: response.length,
    });
  }

  if (sessionStore.monstersTeam.totalCount === 6) {
    setSessionStore("isGiveMonsters", true);
    setSessionStore("monstersTeam", "totalCount", 0);
    return heal();
  }
};
