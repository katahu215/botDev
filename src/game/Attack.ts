import { findAttack } from "../utils/findAttack";
import { handleActiveBattle } from "../utils/handleActiveBattle";
import { shouldHeal } from "../utils/shouldHeal";
import { delayAttack } from "../utils/sleep";
import { sessionStore } from "../utils/store";
import { ActionClick } from "../utils/useClick";
import { waitForResponse } from "../utils/websocket";
import { runHeal } from "./Heal";

interface AttackParams {
  targetAttack: number | string;
  attempts?: number;
  isHeal?: boolean;
  ignoreFight?: boolean;
}

// isHeal = на каче и добивателе
// внимание сюда если буду делать хил, то ппошёл по маршруту и напал монстр
export const Attack = async ({ targetAttack, attempts = Infinity, isHeal, ignoreFight }: AttackParams): Promise<any> => {
  let waiter = null;
  let attack = null;

  for (let i = 0; i < attempts; i++) {
    await delayAttack();
    if (!isHeal && shouldHeal()) break; // запущен без хилера можно проверить

    attack = findAttack(targetAttack);
    if (!attack) break;

    waiter = waitForResponse("/do/fight/attack");
    if (!(await ActionClick.handleClickAttack(attack?.num))) return false;
    await waiter;

    if (sessionStore.isEnded || shouldHeal()) break;
  }

  // Тут ломается место на автокомбате
  if (!ignoreFight && !sessionStore.isEnded) {
    handleActiveBattle();
    return false;
  }

  /// Бой окончен успешно, но нужен хил
  if (shouldHeal({ attack }) || isHeal) {
    runHeal();
    return false;
  }

  return true;
};
