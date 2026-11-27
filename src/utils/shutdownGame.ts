import { setSessionStore, settingsStore } from "./store";
import { clearAutoItemTimer } from "../game/utils/autoItem";

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const shutdownGame = () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  const delayMs = Number(settingsStore.automation.shutdownDelayMin) * 60_000;
  if (!Number.isFinite(delayMs) || delayMs <= 0) return;

  console.log(timeoutId);

  timeoutId = setTimeout(() => {
    timeoutId = null;
    setSessionStore("isEnabled", false);
    clearAutoItemTimer();
  }, delayMs);
};
