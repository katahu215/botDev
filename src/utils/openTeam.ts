import { delayInterface } from "./sleep";
import { sessionStore } from "./store";
import { ActionClick } from "./useClick";
import { waitForResponse } from "./websocket";

export const toggleTeam = async (close?: boolean) => {
  const waiter = waitForResponse("/do/pokes/load/team");

  if (sessionStore.isMobile) {
    if (!document.querySelector("#divDock")?.classList.contains("active")) {
      await ActionClick.handleClick({ selector: "#divDock .btnDockDevice", mobileDocker: true });
      await delayInterface();
    }
  }

  if (document.querySelectorAll(".divDockIn img")[1].classList.contains("active")) {
    await ActionClick.handleClick({ selector: ".divDockIn .dockitem", index: 1, mobileDocker: true });
  }

  await ActionClick.handleClick({ selector: ".divDockIn .dockitem", index: 1, mobileDocker: true });

  const result = await waiter;

  if (close) await ActionClick.handleClick({ selector: ".divDockIn .dockitem", index: 1, mobileDocker: true });

  return result?.object;
};
