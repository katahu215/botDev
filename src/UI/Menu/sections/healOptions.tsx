import { appService, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";
import Switcher from "../../Component/Switcher";

export const getHealOptions = () => [
  {
    id: 100,
    title: "Лечение",
    children: (
      <div class="List">
        <Button
          class="Item values"
          iconName="pen"
          value={settingsStore.survival.minHpPercent}
          onClick={() =>
            modalService.open(Confirm, {
              title: "Процент",
              noClose: true,
              showInput: true,
              isNumber: true,
              inputPlaceholder: "число",
              initialValue: settingsStore.survival.minHpPercent,
              onConfirm: (value: any) => appService.updateSettings("survival", { minHpPercent: value }),
            })
          }
        >
          Процент для лечения:
        </Button>
        <Switcher title="Через арену ЛЧ" checked={settingsStore.survival.useArenaHeal} onChange={(val) => appService.updateSettings("survival", { useArenaHeal: val })} class="Item" />
      </div>
    ),
  },
];
