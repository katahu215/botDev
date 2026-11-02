import { ActionClick } from "./useClick";
import { waitForResponse } from "./websocket";

export const toggleTeam = async (close?: boolean) => {
  const waiter = waitForResponse("/do/pokes/load/team");

  if (document.querySelectorAll(".divDockIn .icon")[1].classList.contains("active")) {
    await ActionClick.handleClick({ selector: ".divDockIn .icon", index: 1 });
  }

  await ActionClick.handleClick({ selector: ".divDockIn .icon", index: 1 });

  const result = await waiter;

  if (close) await ActionClick.handleClick({ selector: ".divDockIn .icon", index: 1 });

  return result?.object;
};
