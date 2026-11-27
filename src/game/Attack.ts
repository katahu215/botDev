import { findAttack } from "./utils/findAttack";
import { handleActiveBattle } from "../utils/handleActiveBattle";
import { shouldHeal } from "./utils/shouldHeal";
import { delayAttack } from "../utils/sleep";
import { sessionStore } from "../utils/store";
import { waitForResponse } from "../utils/websocket";
import { heal } from "./heal";
import { ActionClick } from "./utils/useClick";

interface AttackParams {
  targetAttack: number | string;
  attempts?: number;
  isHeal?: boolean;
  combo?: boolean;
}

// isHeal = на каче и добивателе
export const Attack = async ({ targetAttack, attempts = Infinity, isHeal, combo }: AttackParams): Promise<any> => {
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

    if (sessionStore.isBattleFinished || shouldHeal()) break;
  }

  if (!combo && !sessionStore.isBattleFinished) {
    handleActiveBattle();
    return false;
  }

  /// Бой окончен успешно, но нужен хил
  if (shouldHeal({ attack }) || isHeal) {
    heal();
    return false;
  }

  return true;
};
