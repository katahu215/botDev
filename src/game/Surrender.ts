import { informer } from "../utils/Notification";
import { delayAttack } from "../utils/sleep";
import { sessionStore } from "../utils/store";
import { toggleAutoConfirm } from "../utils/toggleAutoConfirm";
import { ActionClick } from "../utils/useClick";
import { waitForResponse } from "../utils/websocket";

export const Surrender = async () => {
  if (sessionStore.isAgro) {
    informer.error("Ошибка", "Агрессивная локация.");
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
