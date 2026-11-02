import { sessionStore, settingsStore } from "./store";
interface ShouldHealOptions {
  currentHp?: number;
  setMaxHp?: number;
  attack?: any;
}
export const shouldHeal = ({ currentHp, setMaxHp, attack }: ShouldHealOptions = {}): boolean => {
  const hp = currentHp ?? sessionStore.iPoke.hp;
  const maxHp = setMaxHp ?? sessionStore.iPoke.hp_max;
  const hpPercent = (hp / maxHp) * 100;
  if (hpPercent <= Number(settingsStore.limitHp)) return true;

  if (settingsStore.useLimitPp) {
    if (attack?.pp - 1 <= Number(settingsStore.limitPp) || attack?.back) return true;
  }

  return false;
};
