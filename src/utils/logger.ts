import { sessionStore, settingsStore, win } from "./store";

export const log = (message: string) => {
  if (!settingsStore.alertEnabled) return;

  if (sessionStore.isMobile) return win?.KotlinBridge?.showNotification(message);

  win?.ssevsType.triggerInformer(message);
};
