import { shutdownGame } from "../../../utils/shutdownGame";
import { appService, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";

export const getTimerOptions = () => [
  {
    id: 105,
    title: "Отключение",
    children: (
      <>
        <div class="secondary-text">Остановит работу приложения. Укажите время в минутах.</div>
        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.automation.shutdownDelayMin}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Минуты",
                noClose: true,
                showInput: true,
                isNumber: true,
                initialValue: settingsStore.automation.shutdownDelayMin,
                onConfirm: (value: any) => appService.updateSetting("automation", "shutdownDelayMin", value),
              })
            }
          >
            Стоп через:
          </Button>
        </div>
        <Button class="Button Item cn" style={{ color: "var(--color-prime)", "margin-top": "0.25rem" }} onClick={() => shutdownGame()}>
          Использовать
        </Button>
      </>
    ),
  },
];
