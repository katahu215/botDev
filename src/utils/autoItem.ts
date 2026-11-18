import { log } from "./logger";
import { delay, delayInterface } from "./sleep";
import { sessionStore, settingsStore } from "./store";
import { toggleSwitch } from "./toggleSwitch";
import { ActionClick } from "./useClick";
import { waitForResponse } from "./websocket";

interface Timer {
  isRunning: boolean;
  timeoutId: number | null;
}
let timer: Timer = {
  isRunning: false,
  timeoutId: null,
};

export const autoItem = async () => {
  if (timer.isRunning) return;
  timer.isRunning = true;
  await toggleSwitch(false);

  try {
    if (timer.timeoutId !== null) {
      clearTimeout(timer.timeoutId);
      timer.timeoutId = null;
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

      const itemIndex = response.object.items.findIndex((el: any) => el[1] === settingsStore.autoItem);
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
        const from = new Date(sessionStore.timerItem.from.replace(" ", "T") + "Z");
        const to = new Date(sessionStore.timerItem.to.replace(" ", "T") + "Z");

        timer.timeoutId = setTimeout(() => {
          timer.timeoutId = null;
          autoItem();
        }, to.getTime() - from.getTime());
        break;
      }
    }
  } finally {
    if (document.querySelectorAll(".divDockIn img")[2].classList.contains("active")) {
      document.querySelectorAll<HTMLElement>(".divDockIn .icon")[2]?.click();
    }
    await toggleSwitch(true);
    timer.isRunning = false;
  }
};
