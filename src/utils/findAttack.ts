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

const ignoreAttack = ["Подставной ход", "Крик банши", "Замедленная бомба"];
const isAttackUsable = (attack: PokemonMove, element?: Element) => attack.pp > settingsStore.limitPp && !element?.classList.contains("disabled");

export const findAttack = (target: string | number) => {
  const movesObj = sessionStore.iPoke?.moves ?? {};
  const monsterArray = Object.values(movesObj).filter((m): m is PokemonMove => m !== null);

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

  //// 13 призрак 12 обычка

  const isGhost = sessionStore.hPoke.typ.includes(13);

  const usableAttacks = monsterArray.filter((m) => {
    if (ignoreAttack.includes(m.title)) return false;
    if (!m.power) return false;

    const moveElement = moveElements[m.num - 1];
    if (!isAttackUsable(m, moveElement)) return false;

    if (isGhost && m.typ === 12) return false; /// если моб призрак,а атака обычного типа

    return true;
  });

  attack = usableAttacks[0];

  if (target === 100) {
    if (!usableAttacks.length) return null;

    const isOnlyOne = usableAttacks.length === 1;

    return {
      num: attack.num,
      pp: 100000,
      back: isOnlyOne && attack.pp === 1, // back только если единственная и pp === 1
      notFound: false,
    };
  }

  return (attack && { num: attack.num, pp: attack.pp, back: true, notFound }) || null;
};
