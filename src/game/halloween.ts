import { ActionClick } from "../utils/useClick";

// Хел готов и работает
export const payHalloween = async () => {
  await ActionClick.handleContextClick({ searchText: "Отдать", selector: ".divHalloweenTrick .divHalloweenTrickButtons .button.gray.withtext", force: true });
};
export const catchCandy = async () => {
  for (let i = 0; i < 8; i++) {
    if (!document.querySelector(".divHalloweenCandy")) return;
    await ActionClick.handleClick({ selector: ".divHalloweenCandy", force: true });
  }
};
