import { monstersStore, sessionStore, settingsStore } from "../utils/store";

import { log } from "../utils/logger";

import { Attack } from "./Attack";
import { upLvl } from "./upLvl";

import { surrender } from "./surrender";
import { catchAttack } from "./catch";
import { toggleSwitch } from "./utils/toggleSwitch";
import { comboAttack } from "./ComboAttack";

const reaction: Record<number, () => void> = {
  1: () => () => log("Напал редкий монстр."),
  2: () => (settingsStore.leveling.targetMonsterId ? upLvl() : Attack({ targetAttack: settingsStore.battle.attackSkillId })),
  3: () => () => {},
  4: () => surrender(),
  5: () => Attack({ targetAttack: 1 }),
  6: () => Attack({ targetAttack: 2 }),
  7: () => Attack({ targetAttack: 3 }),
  8: () => Attack({ targetAttack: 4 }),
  9: () => comboAttack(1),
  10: () => comboAttack(2),
  11: () => comboAttack(3),
  12: () => comboAttack(4),
};

export const mainController = async () => {
  if (sessionStore.isEnabled) await toggleSwitch(true);

  if (sessionStore.isEnabled && !sessionStore.isBattleFinished) {
    const monster = monstersStore[sessionStore.opponentMonster.sp_id];
    if (!monster) return log("Сообщите об отсутствии монстра в базе!");

    if (sessionStore.opponentMonster.shine) {
      const shine = sessionStore.opponentMonster.shine;

      if (sessionStore.opponentMonster.wild.catchlimit === -1 && settingsStore.catch.shine.isEnabled) {
        if (shine === 2 && settingsStore.catch.shine.useSuperBall) return catchAttack({ ball: 18 });
        return catchAttack({ ball: 13 });
      }

      return log("Напал шайни.");
    }
    if (monster.cat === 3) return handleCat3(monster);

    // колючки пикана
    if (sessionStore.permissions.isAdmin) {
      // if (monster.cat === 2 && monster.id === 331 && sessionStore.opponentMonster.lvl > 90) return comboAttack();
      // if (monster.id === 261) return comboAt(1);
    }

    reaction[monster.cat]();
  }
};

const handleCat3 = (monster: any) => {
  if (sessionStore.opponentMonster.wild.catchlimit !== -1) return reaction[2](); // не ловится
  if (!settingsStore.catch.genderFilter.includes(0) && !settingsStore.catch.genderFilter.includes(sessionStore.opponentMonster.gender)) return reaction[2](); //// неверный пол

  const monsterId = monster.id;
  const ball = settingsStore.catch.ballId;
  const tauntMonsterIds = [96, 280, 63];
  if (tauntMonsterIds.includes(monsterId)) return catchAttack({ ball, useTaunt: true });

  if (monsterId === 666) {
    if (settingsStore.catch.butterflyFilter.includes(0) || settingsStore.catch.butterflyFilter.includes(sessionStore.opponentMonster.form)) return catchAttack({ ball: 30 });
    return reaction[2](); /// иначе убиваем
  }
  if (monsterId === 201) {
    if (settingsStore.catch.semantFilter.includes(0) || settingsStore.catch.semantFilter.includes(sessionStore.opponentMonster.form)) return catchAttack({ ball });
    return reaction[2](); /// иначе убиваем
  }

  return catchAttack({ ball });
};
