import { monstersStore, sessionStore, settingsStore } from "../utils/store";
// import { Attack } from "./Attack";
import { Surrender } from "./Surrender";
// import { Catch } from "./Catch";
import { informer } from "../utils/Notification";

import { toggleSwitch } from "../utils/toggleSwitch";
import { Attack } from "./Attack";
import { Catch } from "./Catch";
import { LvlUp } from "./LvlUp";

const reaction: Record<number, () => void> = {
  1: () => informer.info("Монстр", "Напал редкий монстр."),
  2: () => (settingsStore.lvlUpMonster ? LvlUp() : Attack({ targetAttack: settingsStore.attackSkill })),
  3: () => () => {},
  4: () => Surrender(),
  5: () => Attack({ targetAttack: 1 }),
  6: () => Attack({ targetAttack: 2 }),
  7: () => Attack({ targetAttack: 3 }),
  8: () => Attack({ targetAttack: 4 }),
};

export const mainController = async () => {
  if (sessionStore.isRunning) await toggleSwitch(true);

  if (sessionStore.isRunning && !sessionStore.isEnded) {
    const monster = monstersStore[sessionStore.hPoke.sp_id];
    if (!monster) return informer.error("Монстр", "Сообщите об отсутствии монстра в базе!");

    if (sessionStore.hPoke.shine) {
      const shine = sessionStore.hPoke.shine;

      if (sessionStore.hPoke.wild.catchlimit === -1 && settingsStore.shine.catchShine) {
        if (shine === 2 && settingsStore.shine.useSuperBall) return Catch({ ball: 18 });
        return Catch({ ball: 13 });
      }

      return informer.warning("Шайни", "Напал шайни.");
    }
    if (monster.cat === 3) return handleCat3(monster);

    reaction[monster.cat]();
  }
};

const handleCat3 = (monster: any) => {
  if (sessionStore.hPoke.wild.catchlimit !== -1) return reaction[2](); // не ловится
  if (!settingsStore.gender.includes(0) && !settingsStore.gender.includes(sessionStore.hPoke.gender)) return reaction[2](); //// неверный пол

  const monsterId = monster.id;
  const ball = settingsStore.monsterBall;
  console.log(monsterId);
  const tauntMonsterIds = [96, 280, 63];
  if (tauntMonsterIds.includes(monsterId)) return Catch({ ball, useTaunt: true });

  if (monsterId === 666) {
    if (settingsStore.butterfly.includes(0) || settingsStore.butterfly.includes(sessionStore.hPoke.form)) return Catch({ ball: 30 });
    return reaction[2](); /// иначе убиваем
  }
  if (monsterId === 201) {
    if (settingsStore.semant.includes(0) || settingsStore.semant.includes(sessionStore.hPoke.form)) return Catch({ ball });
    return reaction[2](); /// иначе убиваем
  }

  return Catch({ ball });
};
