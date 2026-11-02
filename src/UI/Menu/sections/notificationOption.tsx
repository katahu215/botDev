import { appService, settingsStore } from "../../../utils/store";
import Switcher from "../../Component/Switcher";

export const getNotificationOptions = () => [
  {
    id: 40,
    title: "Уведомления",
    children: (
      <>
        <div class="List">
          <Switcher title="Уведомления" checked={settingsStore.alertEnabled} onChange={(val) => appService.updateSettings("alertEnabled", val)} class="Item" />
          <Switcher title="Остановить" checked={settingsStore.alertStopBot} onChange={(val) => appService.updateSettings("alertStopBot", val)} class="Item" />
        </div>
        <div class="secondary-text">Остановит работу если кто-то написал.</div>
      </>
    ),
  },
];
