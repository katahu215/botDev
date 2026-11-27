import { delay } from "../../utils/sleep";
import { sessionStore, win } from "../../utils/store";
import { resolveCaptcha } from "./captcha";

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
      if (sessionStore.isMobile) return await ActionClick.clickMobile(selector, index, mobileDocker);

      return await win.ssevsType.triggerClick(selector, index);
    } catch (error) {
      console.error("Ошибка клика по селектору:", error);
      return false;
    }
  },
  async handleClickAttack(key: number, priority?: boolean) {
    const index = key > 0 ? key - 1 : 0;
    if (sessionStore.isMobile) return await ActionClick.handleClick({ selector: fight_selector, index: key - 1 });

    if (priority) return await ActionClick.handleClick({ selector: fight_selector, index }); // это что бы не багался меню атаки при каче

    return await ActionClick.handleHotkey(index);
  },
  async handleContextClick({ searchText, selector, force, mobileDocker }: ContextOptions) {
    const selectorTarget = selector ?? ".divContext .divElements .divElement.clickable";

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectorTarget));
    const index = elements.findIndex((el) => el.textContent?.trim().includes(searchText));

    if (index === -1) return false;

    return await ActionClick.handleClick({ selector: selectorTarget, index, force, mobileDocker });
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
  async clickMobile(selector: string, index: number, mobileDocker: boolean | undefined) {
    if (win?.KotlinBridge) {
      return await ActionClick.clickAndroid(selector, index, mobileDocker);
    } else {
      // Для iOS вызываем нашу навороченную JS-эмуляцию
      return await ActionClick.clickIOS(selector, index, mobileDocker);
    }
  },
  async clickIOS(selector: string, index: number, mobileDocker: boolean | undefined) {
    if (!(await closeAllMenu(mobileDocker))) return false;
    console.log(true);

    const elements = document.querySelectorAll(selector);
    if (elements.length <= index) {
      console.warn(`Элемент не найден по селектору: ${selector}[${index}]`);
      return false;
    }

    const el = elements[index];
    el.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });

    const rect = el.getBoundingClientRect();

    // Вычисляем зону с отступом 30% от краев (оставляем центральные 40% для кликов)
    const marginX = rect.width * 0.3;
    const marginY = rect.height * 0.3;

    // Доступная ширина и высота для рандома
    const availableWidth = rect.width - marginX * 2;
    const availableHeight = rect.height - marginY * 2;

    // Если элемент слишком маленький, падаем обратно на центр с небольшим смещением
    const randomX = availableWidth > 0 ? marginX + Math.random() * availableWidth : rect.width / 2;
    const randomY = availableHeight > 0 ? marginY + Math.random() * availableHeight : rect.height / 2;

    const x = rect.left + randomX;
    const y = rect.top + randomY;

    // === ВИЗУАЛЬНЫЙ ОТЛАДОЧНЫЙ МАРКЕР ===
    const marker = document.createElement("div");
    marker.style.position = "fixed";
    marker.style.left = `${x - 6}px`;
    marker.style.top = `${y - 6}px`;
    marker.style.width = "12px";
    marker.style.height = "12px";
    marker.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    marker.style.border = "2px solid white";
    marker.style.borderRadius = "50%";
    marker.style.zIndex = "9999999";
    marker.style.pointerEvents = "none";
    marker.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    marker.style.transform = "scale(1.4)";
    document.body.appendChild(marker);

    // Анимация исчезновения маркера
    setTimeout(() => {
      marker.style.opacity = "0";
      marker.style.transform = "scale(0.5)";
      setTimeout(() => marker.remove(), 600);
    }, 400);
    // ===================================

    const target = document.elementFromPoint(x, y) || el;

    target.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
      }),
    );

    // Случайный размер и форма пальца (эллипс контакта)
    const rx = 8.0 + Math.random() * 6.0;
    const ry = 10.0 + Math.random() * 8.0;
    const forceVal = 0.5 + Math.random() * 0.5;

    // Создаем объект Touch для мобильного Safari с динамическими размерами
    const touchObj = new Touch({
      identifier: Date.now(),
      target: target,
      clientX: x,
      clientY: y,
      radiusX: rx,
      radiusY: ry,
      rotationAngle: Math.random() * Math.PI,
      force: forceVal,
    });

    const touchInit = {
      cancelable: true,
      bubbles: true,
      view: window,
      touches: [touchObj],
      targetTouches: [touchObj],
      changedTouches: [touchObj],
    };

    target.dispatchEvent(new TouchEvent("touchstart", touchInit));
    target.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
      }),
    );

    if (typeof (target as HTMLElement).focus === "function") {
      (target as HTMLElement).focus();
    }

    const holdTime = 60 + Math.random() * 60;
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Фаза отпускания (touchend + pointerup + click)
        target.dispatchEvent(new TouchEvent("touchend", touchInit));
        target.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
          }),
        );

        // Синтетический клик без дублирующего нативного вызова .click()
        target.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
          }),
        );

        await delay(300, 500);
        resolve(true);
      }, holdTime);
    });
  },
};

const guard = async (force = false) => {
  if (!sessionStore.isEnabled && !force) return false;
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
