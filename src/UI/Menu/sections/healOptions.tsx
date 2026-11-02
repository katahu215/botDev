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
          value={settingsStore.limitHp}
          onClick={() =>
            modalService.open(Confirm, {
              title: "Процент",
              noClose: true,
              showInput: true,
              isNumber: true,
              inputPlaceholder: "число",
              initialValue: settingsStore.limitHp,
              onConfirm: (value: any) => appService.updateSettings("limitHp", value),
            })
          }
        >
          Процент для лечения:
        </Button>
        <Switcher title="Через арену ЛЧ" checked={settingsStore.useArenaHeal} onChange={(val) => appService.updateSettings("useArenaHeal", val)} class="Item" />
      </div>
    ),
  },
];
