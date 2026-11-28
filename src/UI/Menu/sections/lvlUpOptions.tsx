import { appService, optionsRadioGroup, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";
import RadioGroup from "../../Component/Radio";

const currentAttackLabel = () => optionsRadioGroup.lvlUpSkill.find((i) => i.value === settingsStore.leveling.skillId)?.label ?? "";

export const getLvlUpOptions = (pushScreen: (id: number) => void) => [
  {
    id: 20,
    title: "Прокачка",
    children: (
      <>
        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.leveling.targetMonsterId}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Качать",
                text: "id удалится после перезагруки.",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "id монстра",
                initialValue: settingsStore.leveling.targetMonsterId,
                onConfirm: (value: any) => appService.setSetting("leveling", "targetMonsterId", value), //  не обновлять в базе
              })
            }
          >
            Кого качать:
          </Button>
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.leveling.maxLevel}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Уровень",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "число",
                initialValue: settingsStore.leveling.maxLevel,
                onConfirm: (value: any) => appService.updateSetting("leveling", "maxLevel", value),
              })
            }
          >
            До уровня:
          </Button>
        </div>
        <div class="List">
          <Button class="Item" value={currentAttackLabel()} onClick={() => pushScreen(21)} iconName="list">
            Выбор атаки
          </Button>
        </div>
      </>
    ),
  },
  {
    id: 21,
    title: "Атаки",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.lvlUpSkill} value={settingsStore.leveling.skillId} name="lvlUpSkill" onChange={(value) => appService.updateSetting("leveling", "skillId", value)} />
      </div>
    ),
  },
];
