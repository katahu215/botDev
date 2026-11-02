import { Attack } from "../game/Attack";
import { runHeal } from "../game/Heal";
import { Surrender } from "../game/Surrender";
import { Swap } from "../game/Swap";
import { settingsStore } from "./store";

export const handleActiveBattle = async (): Promise<any> => {
  //  Если есть добиватель
  if (settingsStore.finishMonster) {
    if (await Swap(settingsStore.finishMonster)) {
      return Attack({
        targetAttack: settingsStore.finishSkill,
        isHeal: true,
      });
    }
    // сменить не получилось, значит идём сдаваться
  }

  //  Если финишера нет
  if (await Surrender()) return runHeal();
};
