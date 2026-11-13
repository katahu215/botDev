import { informer } from "../utils/Notification";
import { delay, delayGo, delayInterface } from "../utils/sleep";
import { sessionStore, settingsStore } from "../utils/store";
import { toggleSwitch } from "../utils/toggleSwitch";
import { ActionClick } from "../utils/useClick";
import { waitForResponse } from "../utils/websocket";

export const trade = async () => {
  const trainer = document.querySelector<HTMLElement>("#divTalkTrainerLabel .trainer .emblem");
  trainer?.click();

  await delayInterface();

  const waiter = waitForResponse("/do/inviter/send/trade");

  const elements = Array.from(document.querySelectorAll(".divContext .divElements .divElement.clickable"));
  const trader = elements.find((el) => el.textContent.trim().includes("Обмен")) as HTMLElement;
  trader.click();

  await waiter;
  await delayInterface();

  //

  const result = await toggleTeam();

  let clickedCount = 0;

  for (let i = 0; i < result.length; i++) {
    if (clickedCount >= 3) break;

    const monster = result[i];

    if (monster.gender?.includes(2)) continue;

    const button = document.querySelector(`.divPokeTeam .poke[data-p-id="${monster.id}"] .maincardContainer .title .button.justicon`) as HTMLElement;

    if (button) {
      const waiterResponse = waitForResponse("/do/pc/farm/poke");
      button.click();
      await waiterResponse;

      clickedCount++;
      await delayGo();
    }
  }

  await toggleTeam(false);
};

const toggleTeam = async (close?: boolean) => {
  const waiter = waitForResponse("/do/pokes/load/team");

  let button = document.querySelectorAll(".divDockIn .icon")[1] as HTMLElement;

  if (document.querySelectorAll(".divDockIn .icon")[1].classList.contains("active")) {
    button.click();
  }

  button.click();
  const result = await waiter;

  if (close) button.click();

  return result?.object;
};

let timeoutId: number | null = null;

// Переделать полностью тут жесткий1 баг с кликами
export const autoItem = async () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  let success = false;
  try {
    await toggleSwitch(false);

    // Если бой активен ждем окончания
    let attempts = 3;
    while (!sessionStore.isEnded) {
      attempts--;
      if (attempts < 0) throw new Error("Превышено время ожидания авто-предмета");
      await delay(2000, 2000);
    }

    for (let i = 0; i < 5; i++) {
      let waiter = waitForResponse("/do/items/load");

      if (document.querySelectorAll(".divDockIn img")[2].classList.contains("active")) {
        await ActionClick.handleClick({ selector: ".divDockIn img", index: 2 });
      }

      await ActionClick.handleClick({ selector: ".divDockIn img", index: 2 });

      let response = await waiter;

      const itemIndex = response.object.items.findIndex((el: any) => el[1] === settingsStore.autoItem);

      if (itemIndex === -1) {
        informer.error("Ошибка", "Предмет для использования не найден");
        return;
      }

      await ActionClick.handleClick({ selector: ".divItemList .item.clickable", index: itemIndex });

      await delayInterface();

      waiter = waitForResponse("/do/items/use");

      if (!(await ActionClick.handleContextClick({ searchText: "Использовать", selector: ".hint .hintmenu .button" }))) {
        await delay(1000, 1000);
        continue;
      }

      response = await waiter;
      if (response.code === 500) {
        success = true;
        break;
      }
    }

    if (!success) throw new Error("Превышено количесво попыток использовать предмет");

    if (sessionStore.timerItem && sessionStore.timerItem.from && sessionStore.timerItem.to) {
      const startTime = new Date(sessionStore.timerItem.from.replace(" ", "T")).getTime();
      const endTime = new Date(sessionStore.timerItem.to.replace(" ", "T")).getTime();
      const delay = Math.max(0, endTime - startTime);

      timeoutId = setTimeout(() => {
        autoItem();
      }, delay + 2000);
    }

    await toggleSwitch(true);
  } catch (error) {
    informer.error("Ошибка", `Ошибка при использовании авто-предмета: ${error}`);
  } finally {
    await toggleSwitch(true);
  }
};
