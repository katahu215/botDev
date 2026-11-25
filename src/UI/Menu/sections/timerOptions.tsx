import { shutdownGame } from "../../../game/utils/shutdownGame";
import { appService, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";

export const getTimerOptions = () => [
  {
    id: 105,
    title: "Таймер",
    children: (
      <>
        <div class="secondary-text">Остановит работу приложения.</div>
        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.automation.shutdownDelayMin}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Стоп через:",
                text: "Указывать строго в минутах.",
                noClose: true,
                showInput: true,
                isNumber: true,
                initialValue: settingsStore.automation.shutdownDelayMin,
                onConfirm: (value: any) => appService.updateSettings("automation", { shutdownDelayMin: value }),
              })
            }
          >
            Стоп через:
          </Button>
        </div>
        <Button class="Button Item cn" style={{ color: "var(--color-prime)", "margin-top": "0.25rem" }} onClick={() => shutdownGame()}>
          Использовать/Обновить
        </Button>
      </>
    ),
  },
];
