import { appService, optionsRadioGroup, setSettingsStore, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";
import RadioGroup from "../../Component/Radio";

export const getLvlUpOptions = (pushScreen: (id: number) => void) => [
  {
    id: 20,
    title: "Прокачка",
    children: (
      <>
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(21)} iconName="list">
            Выбор атаки
          </Button>
        </div>
        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.lvlUpMonster}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Качать",
                text: "Данные удаляются после перезагрузки",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "id монстра",
                initialValue: settingsStore.lvlUpMonster,
                onConfirm: (value: any) => setSettingsStore("lvlUpMonster", value),
              })
            }
          >
            Кого качать:
          </Button>
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.maxLvl}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Уровень",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "число",
                initialValue: settingsStore.maxLvl,
                onConfirm: (value: any) => appService.updateSettings("maxLvl", value),
              })
            }
          >
            До уровня:
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
        <RadioGroup options={optionsRadioGroup.lvlUpSkill} value={settingsStore.lvlUpSkill} name="lvlUpSkill" onChange={(val) => appService.updateSettings("lvlUpSkill", val)} />
      </div>
    ),
  },
];
