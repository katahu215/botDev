import { appService, optionsRadioGroup, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";
import RadioGroup from "../../Component/Radio";
import Switcher from "../../Component/Switcher";

export const getFightOptions = (pushScreen: (id: number) => void) => [
  {
    id: 1,
    title: "Бои",
    children: (
      <>
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(2)} iconName="list">
            Выбор атаки
          </Button>
        </div>
        <div class="List">
          <Switcher title="Лимит PP" checked={settingsStore.useLimitPp} onChange={(val) => appService.updateSettings("useLimitPp", val)} class="Item" />
        </div>
        <div class="secondary-text">При отключении игнорирует нехватку «pp» после полного исчерпания у всех атак.</div>

        <div class="List">
          <Button class="Item" onClick={() => pushScreen(3)} iconName="flag">
            Добивание
          </Button>
        </div>
      </>
    ),
  },
  {
    id: 2,
    title: "Атаки",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.attackSkill} value={settingsStore.attackSkill} name="attackSkill" onChange={(val) => appService.updateSettings("attackSkill", val)} />
      </div>
    ),
  },
  {
    id: 3,
    title: "Добивание",
    children: (
      <>
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(4)} iconName="list">
            Выбор атаки
          </Button>
        </div>
        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.finishMonster}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Добиватель",
                noClose: true,

                showInput: true,
                isNumber: true,
                inputPlaceholder: "id монстра",
                initialValue: settingsStore.finishMonster,
                onConfirm: (value: any) => appService.updateSettings("finishMonster", value),
              })
            }
          >
            Добиватель:
          </Button>
        </div>
      </>
    ),
  },
  {
    id: 4,
    title: "Атаки",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.attackSkill} value={settingsStore.finishSkill} name="finishSkill" onChange={(val) => appService.updateSettings("finishSkill", val)} />
      </div>
    ),
  },
];
