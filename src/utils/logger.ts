import { sessionStore, settingsStore, win } from "./store";

export const log = (message: string) => {
  if (!settingsStore.alerts.isEnabled) return;
  if (sessionStore.isMobile) return mobileNotification(message);
  win?.ssevsType.triggerInformer(message);
};

const mobileNotification = (message: string) => {
  if (win?.KotlinBridge) return win?.KotlinBridge?.showNotification(message);
  win.iosBridge.showNotification(message);
};
