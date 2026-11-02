import { appService, settingsStore } from "../../../utils/store";
import Switcher from "../../Component/Switcher";

export const getHalloweenOptions = () => [
  {
    id: 110,
    title: "Хэллоуин",
    children: (
      <div class="List">
        <Switcher title="Отдавать деньги" checked={settingsStore.halloween.usePay} onChange={(val) => appService.updateSettings("halloween", { usePay: val })} class="Item" />
        <Switcher title="Ловить конфеты" checked={settingsStore.halloween.useCandy} onChange={(val) => appService.updateSettings("halloween", { useCandy: val })} class="Item" />
      </div>
    ),
  },
];
