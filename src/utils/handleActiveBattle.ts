import { Attack } from "../game/Attack";
import { heal } from "../game/heal";
import { surrender } from "../game/surrender";
import { swap } from "../game/swap";
import { settingsStore } from "./store";

export const handleActiveBattle = async (): Promise<any> => {
  //  Если есть добиватель
  if (settingsStore.battle.finishTargetMonsterId) {
    if (await swap(settingsStore.battle.finishTargetMonsterId)) {
      return Attack({
        targetAttack: settingsStore.battle.finishSkillId,
        isHeal: true,
      });
    }
    // сменить не получилось, значит идём сдаваться
  }

  //  Если финишера нет
  if (await surrender()) return heal();
};
