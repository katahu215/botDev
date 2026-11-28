import { handleActiveBattle } from "../utils/handleActiveBattle";
import { log } from "../utils/logger";
import { sessionStore, settingsStore } from "../utils/store";
import { Attack } from "./Attack";
import { heal } from "./heal";
import { swap } from "./swap";
import { shouldHeal } from "./utils/shouldHeal";

const STATUS_MAP: Record<number, number> = { 1: 13, 2: 8, 3: 14 };

const runSteps = async (steps: any) => {
  for (const step of steps) {
    switch (step.type) {
      case "swap": {
        if (sessionStore.isBattleFinished) return false; /// обязательн перед каждой атакой и свапом что бы выяснить есть ли бой или жив ли моб
        const ok = await swap(step.id);
        if (!ok) return false;
        break;
      }
      case "attack": {
        if (sessionStore.isBattleFinished) return false;
        // Изначально считаем шаг невыполненным, пока не подтвердится успех
        let ok = false;
        if (step.status) {
          for (let i = 0; i < step.attempts; i++) {
            const attacked = await Attack({ targetAttack: step.id, attempts: 1, combo: true });
            if (!attacked) break;
            console.log(attacked);
            if (sessionStore.opponentMonster?.status[STATUS_MAP[step.status]]) {
              ok = true; // Статус наложен —  выходим из цикла
              break;
            }
          }
          // Если все попытки кончились, а статус так и не появился — ok останется false
        } else {
          ok = await Attack({ targetAttack: step.id, attempts: step.attempts, combo: true });
        }

        // Если шаг атаки провалился (или статус не наложился за все попытки) — прерываем комбо
        if (!ok) return false;
        break;
      }
      default:
        log(`Неизвестный тип шага: ${(step as { type: string }).type}`);
        return false;
    }
  }
  return true;
};

export const comboAttack = async (numberCombo: number) => {
  const def = settingsStore.combo[numberCombo];
  if (!def) return log(`Комбо не найдено: ${numberCombo}`);

  const completed = await runSteps(def.steps);

  if (!completed && !sessionStore.isBattleFinished) return handleActiveBattle(); /// бой еще идет

  if (def.isHeal || shouldHeal()) return heal();
};
