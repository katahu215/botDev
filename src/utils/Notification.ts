import { settingsStore } from "./store";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationPayload {
  title: string;
  body: string;
  type: NotificationType;
}

export const createInformer = (sendToElectron: (item: NotificationPayload) => void) => {
  const show = (title: string, message: string, type: NotificationType) => {
    if (!settingsStore.alertEnabled) return;
    const item: NotificationPayload = { title, body: message, type };
    sendToElectron(item);
  };

  return {
    info: (title: string, message: string) => show(title, message, "info"),
    success: (title: string, message: string) => show(title, message, "success"),
    warning: (title: string, message: string) => show(title, message, "warning"),
    error: (title: string, message: string) => show(title, message, "error"),
  };
};

export const informer = createInformer((item) => {
  console.log("Sending to Electron:", item);
  (window as any)?.ssevsType.triggerInformer(item);
});
