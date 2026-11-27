import { log } from "../utils/logger";
import { delayAttack } from "../utils/sleep";
import { sessionStore } from "../utils/store";
import { toggleAutoConfirm } from "./utils/toggleAutoConfirm";
import { waitForResponse } from "../utils/websocket";
import { ActionClick } from "./utils/useClick";

export const surrender = async () => {
  if (sessionStore.isAgroLocation) {
    log("Агрессивная локация.");
    return false;
  }

  toggleAutoConfirm("Вы уверены, что хотите сдаться?");
  await delayAttack();

  const wait = waitForResponse("/do/fight/surrend");
  await ActionClick.handleContextClick({ searchText: "Сдаться", selector: "#divFightButtons .button.withtext" });
  await wait;

  await ActionClick.handleContextClick({ searchText: "Закрыть", selector: "#divFightButtons .button.withtext" });

  toggleAutoConfirm();
  return true;
};
