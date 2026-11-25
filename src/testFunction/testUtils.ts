import { Attack } from "../game/Attack";
import { heal } from "../game/heal";
import { swap } from "../game/swap";
import { handleActiveBattle } from "../utils/handleActiveBattle";
import { log } from "../utils/logger";
import { delayGo, delayInterface } from "../utils/sleep";
import { sessionStore } from "../utils/store";

import { waitForResponse } from "../utils/websocket";

export const trade = async () => {
  const trainer = document.querySelector<HTMLElement>("#divTalkTrainerLabel .trainer .emblem");
  trainer?.click();

  await delayInterface();

  const waiter = waitForResponse("/do/inviter/send/trade");

  const elements = Array.from(document.querySelectorAll(".divContext .divElements .divElement.clickable"));
  const trader = elements.find((el) => el.textContent.trim().includes("Обмен")) as HTMLElement;
  trader.click();

  await waiter;
  await delayInterface();

  //

  const result = await toggleTeam();

  let clickedCount = 0;

  for (let i = 0; i < result.length; i++) {
    if (clickedCount >= 3) break;

    const monster = result[i];

    if (monster.gender?.includes(2)) continue;

    const button = document.querySelector(`.divPokeTeam .poke[data-p-id="${monster.id}"] .maincardContainer .title .button.justicon`) as HTMLElement;

    if (button) {
      const waiterResponse = waitForResponse("/do/pc/farm/poke");
      button.click();
      await waiterResponse;

      clickedCount++;
      await delayGo();
    }
  }

  await toggleTeam(false);
};

const toggleTeam = async (close?: boolean) => {
  const waiter = waitForResponse("/do/pokes/load/team");

  let button = document.querySelectorAll(".divDockIn .icon")[1] as HTMLElement;

  if (document.querySelectorAll(".divDockIn .icon")[1].classList.contains("active")) {
    button.click();
  }

  button.click();
  const result = await waiter;

  if (close) button.click();

  return result?.object;
};

export const comboAttack = async () => {
  if (!(await swap(13831569))) return false;

  for (let i = 0; i < 5; i++) {
    if (!(await Attack({ targetAttack: "Отравление", attempts: 1, combo: true }))) return false;
    if (sessionStore.opponentMonster.status[13]) break; // 13 отравлен
    if (i === 4) return false;
  }
  if (!(await Attack({ targetAttack: "Отдых", isHeal: true }))) return false;
};

export const combo: any = {
  1: {
    steps: [
      { type: "swap", id: "17153595", attempts: 1 }, /// attempts - неиспольуется в swap
      { type: "attack", id: 1, attempts: 1 }, // id - number | string атак
    ],
    isHeal: true,
  },
};

const runSteps = async (steps: any) => {
  for (const step of steps) {
    switch (step.type) {
      case "swap": {
        const ok = await swap(step.id);
        if (!ok) return false;
        break;
      }
      case "attack":
        await Attack({ targetAttack: step.id, attempts: step.attempts, combo: true });
        break;
      default:
        log(`Неизвестный тип шага: ${(step as { type: string }).type}`);
        return false;
    }
  }
  return true;
};
export const comboAt = async (numberCombo: number) => {
  const def = combo[numberCombo];
  if (!def) return log(`Комбо не найдено: ${numberCombo}`);

  const completed = await runSteps(def.steps);

  if (!completed && !sessionStore.isBattleFinished) return handleActiveBattle(); /// бой еще идет

  if (def.isHeal) return heal();
};
