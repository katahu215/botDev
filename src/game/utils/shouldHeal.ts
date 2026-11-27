import { sessionStore, settingsStore } from "../../utils/store";
interface ShouldHealOptions {
  currentHp?: number;
  setMaxHp?: number;
  attack?: any;
}
export const shouldHeal = ({ currentHp, setMaxHp, attack }: ShouldHealOptions = {}): boolean => {
  const hp = currentHp ?? sessionStore.activeMonster.hp;
  const maxHp = setMaxHp ?? sessionStore.activeMonster.hp_max;
  const hpPercent = (hp / maxHp) * 100;
  if (hpPercent <= Number(settingsStore.survival.minHpPercent)) return true;
  if (attack?.pp - 1 <= Number(settingsStore.survival.minPpPercent) || attack?.back) return true;

  return false;
};
