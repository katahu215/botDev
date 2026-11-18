const TYPES = ["Насекомое", "Тёмный", "Дракон", "Электрический", "Боевой", "Огненный", "Летающий", "Призрак", "Травяной", "Земляной", "Ледяной", "Водный", "Ядовитый", "Психический", "Каменный", "Стальной"];

const SHIFTS: Record<string, number> = { h: 0, a: 1, d: 2, s: 3, sa: 4, sd: 5 };

///BIG
export const calculateType = (data: any) => {
  const pokeEls = document.querySelectorAll<HTMLElement>(".divListPC .poke .shorts");

  data.object.pokes.forEach(({ ivcode }: any, index: number) => {
    let bits = 0;

    ivcode.replace(/([a-z]+)(\d+)/g, (_: string, k: string, v: string) => {
      if (k in SHIFTS) bits |= (Number(v) & 1) << SHIFTS[k];
      return "";
    });

    const typeIndex = Math.floor((bits * 15) / 63);
    const typeName = TYPES[typeIndex];

    const targetEl = pokeEls[index];
    if (targetEl) {
      const title = document.createElement("span");
      title.textContent = typeName;
      title.style.color = "#a0a9b7";
      targetEl.appendChild(title);
    }
  });
};
// SMALL
// export const calculateType = (data: any) => {
//   if (!data || !data.object || !data.object.pokes) return;

//   setTimeout(() => {
//     const pokeEls = document.querySelectorAll<HTMLElement>(".divListPC .poke .extra .ivcode");

//     data.object.pokes.forEach(({ ivcode }: any, index: number) => {
//       let bits = 0;

//       ivcode.replace(/([a-z]+)(\d+)/g, (_: string, k: string, v: string) => {
//         if (k in SHIFTS) bits |= (Number(v) & 1) << SHIFTS[k];
//         return "";
//       });

//       const typeIndex = Math.floor((bits * 15) / 63);
//       const typeName = TYPES[typeIndex];

//       const targetEl = pokeEls[index];
//       // Проверяем, чтобы тип не добавлялся повторно при обновлении
//       if (targetEl && !targetEl.textContent?.includes(typeName)) {
//         targetEl.textContent += ` ${typeName}`;
//       }
//     });
//   }, 50);
// };
