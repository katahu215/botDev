import { resolveCaptcha } from "./captcha";
import { delay } from "./sleep";
import { sessionStore, win } from "./store";

type ClickOptions = {
  index?: number;
  selector: string;
  force?: boolean; /// разрешает клик если бот неактивен
  mobileDocker?: boolean; // не закрывать панель #divDock в мобилке
};
type ContextOptions = {
  searchText: string;
  selector?: string;
  force?: boolean;
  mobileDocker?: boolean;
};

const fight_selector = "#divFightI .moves .divMoveInfo.clickable";

const pendingCallbacks = new Map<string, (result: boolean) => void>();
let counter = 1;
win.__resolveKotlinAction = (callbackId: string, result: boolean) => {
  const resolve = pendingCallbacks.get(callbackId);
  if (resolve) {
    pendingCallbacks.delete(callbackId);
    resolve(result);
  }
};

export const ActionClick = {
  async handleClick({ selector, index = 0, force, mobileDocker }: ClickOptions) {
    if (!(await guard(force))) return false;

    try {
      if (sessionStore.isMobile) return await ActionClick.clickAndroid(selector, index, mobileDocker);

      return await win.ssevsType.triggerClick(selector, index);
    } catch (error) {
      console.error("Ошибка клика по селектору:", error);
      return false;
    }
  },
  async handleClickAttack(key: number, priority?: boolean) {
    const index = key > 0 ? key - 1 : 0;

    if (sessionStore.isMobile) return await ActionClick.handleClick({ selector: fight_selector, index: key - 1 });

    if (priority) return await this.handleClick({ selector: fight_selector, index }); // это что бы не багался меню атаки при каче

    return await this.handleHotkey(index);
  },
  async handleContextClick({ searchText, selector, force, mobileDocker }: ContextOptions) {
    const selectorTarget = selector ?? ".divContext .divElements .divElement.clickable";

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectorTarget));
    const index = elements.findIndex((el) => el.textContent?.trim().includes(searchText));

    if (index === -1) return false;

    return await this.handleClick({ selector: selectorTarget, index, force, mobileDocker });
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
  async clickAndroid(selector: string, index: number, mobileDocker: boolean | undefined) {
    if (!(await closeAllMenu(mobileDocker))) return false;

    return new Promise((resolve) => {
      const callbackId = `cb_${counter++}`;
      // Сохраняем резолвер в Map
      pendingCallbacks.set(callbackId, resolve);

      win?.KotlinBridge?.triggerClick(selector, index, callbackId);
    });
  },
};

const guard = async (force = false) => {
  if (!sessionStore.isRunning && !force) return false;
  return await resolveCaptcha();
};
const closeAllMenu = async (mobileDocker: boolean = false) => {
  for (let i = 0; i < 5; i++) {
    const btn = document.querySelector("#divDockUpper .btnChatVisio") as HTMLElement;
    const btnClose = document.querySelector("#divDockUpper .btnClose") as HTMLElement;

    if (!btn.classList.contains("pressed")) {
      if (!mobileDocker && btnClose.style.display === "none") return true;
      if (mobileDocker) return true;
    }

    if (btn.style.display !== "none" || btn.classList.contains("pressed")) btn.click();
    if (!mobileDocker && btnClose.style.display !== "none") btnClose.click();

    await delay(50, 100);
  }
  return false;
};
