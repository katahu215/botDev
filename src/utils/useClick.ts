import { solveCaptcha } from "./solveCaptcha";
import { sessionStore } from "./store";

type ClickOptions = {
  index?: number;
  selector: string;
  force?: boolean; /// разрешает клик если бот неактивен
};
type ContextOptions = {
  searchText: string;
  selector?: string;
  force?: boolean;
};

const fight_selector = "#divFightI .moves .divMoveInfo.clickable";
const win = window as any;

export const ActionClick = {
  async handleClick({ selector, index = 0, force }: ClickOptions) {
    if (!(await guard(force))) return false;

    try {
      return await win.ssevsType.triggerClick(selector, index);
    } catch (error) {
      console.error("Ошибка клика по селектору:", error);
      return false;
    }
  },
  async handleClickAttack(key: number, priority?: boolean) {
    const index = key > 0 ? key - 1 : 0;

    if (priority) return await this.handleClick({ selector: fight_selector, index }); // это что бы не багался меню атаки при каче

    // if (sessionStore.isMobile) return await this.androidClick(fight_selector, key);

    return await this.handleHotkey(index);
  },
  async handleContextClick({ searchText, selector, force }: ContextOptions) {
    const selectorTarget = selector ?? ".divContext .divElements .divElement.clickable";

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectorTarget));
    const index = elements.findIndex((el) => el.textContent?.trim().includes(searchText));

    if (index === -1) return false;

    return await this.handleClick({ selector: selectorTarget, index, force });
  },
  async handleHotkey(key: number) {
    if (!(await guard())) return false;
    // 100 кнопка E
    try {
      return await win.ssevsType.triggerHotkey(key + 1); // +1 защита от 0 - index атаки приходит 0/4
    } catch (error) {
      console.error("Ошибка горячей клавиши:", `${error}`);
      return false;
    }
  },
};

const guard = async (force = false) => {
  if (!sessionStore.isRunning && !force) return false;
  return await solveCaptcha();
};
