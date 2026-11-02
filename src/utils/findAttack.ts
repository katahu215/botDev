import { sessionStore, settingsStore } from "./store";

export type PokemonMove = {
  id: number;
  title: string;
  num: number;
  pp: number;
  pp_max: number;
  typ: number;
  category: number;
  power: number;
  target: number;
};

const ignoreAttack = ["Подставной ход", "Крик банши", "Замедленная бомба", "Крик банши"];
const isAttackUsable = (attack: PokemonMove, element?: Element) => attack.pp > settingsStore.limitPp && !element?.classList.contains("disabled");
export const findAttack = (target: string | number) => {
  const movesObj = sessionStore.iPoke?.moves ?? {};
  const monsterArray = Object.values(movesObj).filter((m): m is PokemonMove => m !== null);

  // const clickableMoves = document.querySelectorAll("#divFightI .moves .divMoveInfo.clickable");
  const moveElements = document.querySelectorAll("#divFightI .moves .divMove");

  let attack: PokemonMove | null | undefined = null;

  if (typeof target === "number") {
    attack = monsterArray.find((m) => m.num === target);
  } else if (typeof target === "string") {
    attack = monsterArray.find((m) => m.title === target);
  }

  const notFound = !attack;

  if (attack) {
    const index = attack.num - 1;
    if (isAttackUsable(attack, moveElements[index])) return { num: attack.num, pp: attack.pp, back: false, notFound };
  }

  //// 13 призрак
  //// 12 обычка

  const isGhost = sessionStore.hPoke.typ.includes(13);
  // attack = monsterArray.find((m) => !ignoreAttack.includes(m.title) && m.power && isAttackUsable(m, moveElements[m.num - 1]));
  attack = monsterArray.find((m) => {
    if (ignoreAttack.includes(m.title)) return false;
    if (!m.power) return false;

    const moveElement = moveElements[m.num - 1];
    if (!isAttackUsable(m, moveElement)) return false;

    if (isGhost && m.typ === 12) return false;

    return true;
  });

  if (!settingsStore.useLimitPp) {
    attack = monsterArray.find((m) => moveElements[m.num - 1]?.classList.contains("disabled"));
    return attack && { num: attack.num, pp: 100000, back: false, notFound };
  }

  return (attack && { num: attack.num, pp: attack.pp, back: true, notFound }) || null;
};
