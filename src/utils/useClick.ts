import { informer } from "./Notification";
import { solveCaptcha } from "./solveCaptcha";
import { sessionStore } from "./store";

type ClickOptions = {
  selector: string;
  index?: number;
  unlock?: boolean;
};

// type AttackOptions = {
//   key: number;
//   priority?: boolean;
// };

type ContextOptions = {
  searchText: string;
  selectors?: string;
  unlock?: boolean;
};

const fight_selector = "#divFightI .moves .divMoveInfo.clickable";

export const ActionClick = {
  async handleClick({ selector, index, unlock }: ClickOptions) {
    if (!sessionStore.isRunning && !unlock) return false;
    if (!(await solveCaptcha())) return false;

    const i = index ?? null;

    try {
      const success = await (window as any).ssevsType.triggerClick(selector, i);
      return success;
    } catch (error) {
      console.error("Ошибка клика по селектору:", error);
      return false;
    }
  },

  async handleClickAttack(key: number, priority?: boolean) {
    if (!sessionStore.isRunning || !(await solveCaptcha())) return false;

    const index = key > 0 ? key - 1 : 0;

    if (priority) return await this.handleClick({ selector: fight_selector, index }); // это что бы не багался меню атаки при каче

    return await this.handleHotkey(key);
    return await ActionClick.handleClick({ selector: fight_selector, index });
  },

  async handleContextClick({ searchText, selectors, unlock }: ContextOptions) {
    if (!sessionStore.isRunning && !unlock) return false;

    const selector = selectors ?? ".divContext .divElements .divElement.clickable";

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const index = elements.findIndex((el) => el.textContent?.trim().includes(searchText));

    if (index === -1) {
      informer.warning("Ошибка", `Элемент с текстом "${searchText}" не найден`);
      return false;
    }
    return await this.handleClick({ selector, index });
  },

  async handleHotkey(key: number) {
    if (!sessionStore.isRunning || !(await solveCaptcha())) return false;

    // 100 кнопка E
    try {
      return await (window as any).ssevsType.triggerHotkey(key);
    } catch (error) {
      console.error("Ошибка горячей клавиши:", error);
      return false;
    }
  },
};
