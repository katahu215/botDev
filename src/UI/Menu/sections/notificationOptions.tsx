import { appService, settingsStore } from "../../../utils/store";
import Switcher from "../../Component/Switcher";

export const getNotificationOptions = () => [
  {
    id: 40,
    title: "Уведомления",
    children: (
      <>
        <div class="List">
          <Switcher title="Уведомления" checked={settingsStore.alerts.isEnabled} onChange={(val) => appService.updateSettings("alerts", { isEnabled: val })} class="Item" />
          <Switcher title="Остановить" checked={settingsStore.alerts.isStopBotOnAlert} onChange={(val) => appService.updateSettings("alerts", { isStopBotOnAlert: val })} class="Item" />
        </div>
        <div class="secondary-text">Остановит работу если кто-то написал.</div>
      </>
    ),
  },
];
