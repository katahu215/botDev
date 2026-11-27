import { appService, settingsStore } from "../../../utils/store";
import Switcher from "../../Component/Switcher";

export const getHalloweenOptions = () => [
  {
    id: 110,
    title: "Хэллоуин",
    children: (
      <div class="List">
        <Switcher title="Отдавать деньги" checked={settingsStore.halloween.usePay} onChange={(value) => appService.updateSetting("halloween", "usePay", value)} class="Item" />

        <Switcher title="Ловить конфеты" checked={settingsStore.halloween.useCandy} onChange={(value) => appService.updateSetting("halloween", "useCandy", value)} class="Item" />
      </div>
    ),
  },
];
