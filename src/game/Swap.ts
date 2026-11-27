import { log } from "../utils/logger";
import { delay, delayInterface } from "../utils/sleep";
import { settingsStore } from "../utils/store";
import { waitForResponse } from "../utils/websocket";
import { ActionClick } from "./utils/useClick";

export const swap = async (targetId: number) => {
  let waiter = null;
  let result = null;

  for (let i = 0; i < 3; i++) {
    waiter = waitForResponse("/do/pokes/load/list");
    await ActionClick.handleClick({ selector: "#divFightI .pokemonBoxDummy.clickable, #divFightI .ball.clickable" });
    result = await waiter;

    await delayInterface();

    const matchedMonster = result.object.find((m: any) => m.id === targetId && (m.hp / m.hp_max) * 100 > settingsStore.survival.minHpPercent);
    if (!matchedMonster) {
      log("Монстр для замены отсутствует или мало хп.");
      return false;
    }

    const monsterIndex = Array.from(document.querySelectorAll(".divContext .divElements .divElement.clickable")).findIndex((m: any) => Number(m.querySelector(".poke")?.getAttribute("data-p-id")) === Number(targetId));
    if (monsterIndex === -1) continue;

    await delay(600, 400);

    waiter = waitForResponse("/do/fight/switche");
    await ActionClick.handleClick({ selector: ".divContext .divElements .divElement.clickable", index: monsterIndex });
    result = await waiter;
    if (result.code === 500) return true;
  }

  log("Невозможно сменить.");
  return false;
};
