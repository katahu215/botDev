import { delay, delayAttack, delayInterface } from "../utils/sleep";
import { settingsStore } from "../utils/store";
import { ActionClick } from "../utils/useClick";
import { waitForResponse } from "../utils/websocket";

export const Swap = async (targetId: string) => {
  let waiter = null;
  let result = null;

  for (let i = 0; i < 3; i++) {
    await delay(2200, 1800);

    waiter = waitForResponse("/do/pokes/load/list");
    await ActionClick.handleClick({ selector: "#divFightI .pokemonBoxDummy.clickable, #divFightI .ball.clickable" });
    result = await waiter;

    await delayInterface();

    const matchedMonster = result.object.find((m: any) => m.id === Number(targetId) && (m.hp / m.hp_max) * 100 > settingsStore.limitHp);
    if (!matchedMonster) return false; /// моба нету или на него нельзя сменить

    const monsterIndex = Array.from(document.querySelectorAll(".divContext .divElements .divElement.clickable")).findIndex((m: any) => Number(m.querySelector(".poke")?.getAttribute("data-p-id")) === Number(targetId));

    await delayAttack();

    waiter = waitForResponse("/do/fight/switche");
    await ActionClick.handleClick({ selector: ".divContext .divElements .divElement.clickable", index: monsterIndex });
    result = await waiter;
    if (result.code === 500) return true;
  }

  return false;
};
