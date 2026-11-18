import { findAttack } from "../utils/findAttack";
import { handleActiveBattle } from "../utils/handleActiveBattle";
import { log } from "../utils/logger";
import { shouldHeal } from "../utils/shouldHeal";
import { delayAttack } from "../utils/sleep";
import { optionsRadioGroup, settingsStore, sessionStore } from "../utils/store";
import { ActionClick } from "../utils/useClick";
import { waitForResponse } from "../utils/websocket";
import { Attack } from "./Attack";
import { runHeal } from "./Heal";
import { Swap } from "./Swap";

export const LvlUp = async () => {
  let waiter = null;
  let attack = null;
  let mobStart = null;

  const foundSkill = optionsRadioGroup.lvlUpSkill.find((item) => item.value === settingsStore.lvlUpSkill)?.label || "";

  for (let i = 0; i < Infinity; i++) {
    await delayAttack();
    if (shouldHeal()) break;
    mobStart = { ...sessionStore.iPoke };

    attack = findAttack(foundSkill);
    if (!attack) break;
    if (attack.notFound) return log("Атака отсутствует.");
    if (attack.back) return Attack({ targetAttack: attack.num, isHeal: true });

    waiter = waitForResponse("/do/pokes/load/list");

    if (!(await ActionClick.handleClickAttack(attack.num, true))) return false;

    const result = await waiter;
    const monster = result.object.find((m: any) => m.id === Number(settingsStore.lvlUpMonster));
    if (!monster) return log("С собой нету монстра или он умер."); //// монстра c собой нет

    await delayAttack();

    if (monster.lvl >= settingsStore.maxLvl) return log("Достигнут необходимый уровень.");
    if ((monster.hp / monster.hp_max) * 100 <= 50) return Attack({ targetAttack: 100, isHeal: true });

    const monsterIndex = Array.from(document.querySelectorAll(".divContext .divElements .divElement.clickable")).findIndex((m) => Number(m.querySelector(".poke")?.getAttribute("data-p-id")) === Number(settingsStore.lvlUpMonster));
    if (monsterIndex === -1) return;

    waiter = waitForResponse("/do/fight/attack");
    if (!(await ActionClick.handleClick({ selector: ".divContext .divElements .divElement.clickable", index: monsterIndex }))) return false;
    await waiter;

    if (sessionStore.isEnded || shouldHeal({ attack })) break;

    if (sessionStore.iPoke.id === Number(settingsStore.lvlUpMonster)) {
      if (!(await Swap(mobStart.id))) break;
    }
  }

  if (!sessionStore.isEnded) return handleActiveBattle();

  if (shouldHeal({ currentHp: mobStart.hp, setMaxHp: mobStart.hp_max, attack })) return runHeal();
};
