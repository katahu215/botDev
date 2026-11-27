import { log } from "../../utils/logger";
import { delay, delayInterface } from "../../utils/sleep";
import { sessionStore, settingsStore } from "../../utils/store";
import { waitForResponse } from "../../utils/websocket";
import { toggleSwitch } from "./toggleSwitch";
import { ActionClick } from "./useClick";

let isRunning = false;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const autoItem = async () => {
  if (isRunning) return;
  isRunning = true;
  await toggleSwitch(false);

  try {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    for (let i = 0; i <= 5; i++) {
      let waiter = waitForResponse("/do/items/load");

      if (sessionStore.isMobile) {
        if (!document.querySelector("#divDock")?.classList.contains("active")) {
          await ActionClick.handleClick({ selector: "#divDock .btnDockDevice", mobileDocker: true });
          await delayInterface();
        }
      }

      if (document.querySelectorAll(".divDockIn img")[2].classList.contains("active")) {
        document.querySelectorAll<HTMLElement>(".divDockIn .icon")[2]?.click();
        await delayInterface();
      }

      document.querySelectorAll<HTMLElement>(".divDockIn .icon")[2]?.click();

      let response = await waiter;

      const itemIndex = response.object.items.findIndex((el: any) => el[1] === settingsStore.automation.autoItemId);
      if (itemIndex === -1) return log("Предмет для использования не найден.");

      // если не все, то открыть все
      if (!document.querySelector(".divDockPanels .panelitems .divItemCats .cat0")?.classList.contains("pressed")) {
        await ActionClick.handleClick({ selector: ".divDockPanels .panelitems .divItemCats .cat0", force: true, mobileDocker: true });
      }

      await delayInterface();
      await ActionClick.handleClick({ selector: ".divItemList .item.clickable", index: itemIndex, force: true, mobileDocker: true });

      waiter = waitForResponse("/do/items/use");
      await delayInterface();
      if (!(await ActionClick.handleContextClick({ searchText: "Использовать", selector: ".hint .hintmenu .button", force: true, mobileDocker: true }))) {
        await delay(1500, 2500);
        continue;
      }
      response = await waiter;

      if (response.code === 500) {
        await delay(1000, 1200); // удерживать для вебсокета

        timeoutId = setTimeout(() => {
          timeoutId = null;
          autoItem();
        }, sessionStore.itemCooldown * 1000);
        break;
      }
    }
  } finally {
    if (document.querySelectorAll(".divDockIn img")[2].classList.contains("active")) {
      document.querySelectorAll<HTMLElement>(".divDockIn .icon")[2]?.click();
    }
    await toggleSwitch(true);
    isRunning = false;
  }
};
export const clearAutoItemTimer = () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};
