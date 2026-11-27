import { appService, optionsRadioGroup, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import CheckboxGroup from "../../Component/CheckBox";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";
import RadioGroup from "../../Component/Radio";
import Switcher from "../../Component/Switcher";

export const getCatchOptions = (pushScreen: (id: number) => void) => [
  {
    id: 30,
    title: "Ловля",
    children: (
      <>
        <div class="secondary-text">При ловле Эни, Ино или Сенс стартовый монстр с Насмешкой.</div>
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(31)} iconName="list">
            Погодные атаки
          </Button>
          <Button class="Item" onClick={() => pushScreen(32)} iconName="list">
            Основные атаки
          </Button>
          <Button class="Item" onClick={() => pushScreen(33)} iconName="list">
            Статусные атаки
          </Button>
        </div>
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(34)} iconName="pokeball">
            Монстробол
          </Button>
          <Button class="Item" onClick={() => pushScreen(35)} iconName="venus-mars">
            Пол
          </Button>
          <Button class="Item" onClick={() => pushScreen(38)} iconName="shine">
            Шайни
          </Button>
        </div>
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(36)} iconName="butterfly">
            Яркокрылы
          </Button>
          <Button class="Item" onClick={() => pushScreen(37)} iconName="semant">
            Семанты
          </Button>
        </div>

        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.catch.targetMonsterId}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Ловец",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "id монстра",
                initialValue: settingsStore.catch.targetMonsterId,
                onConfirm: (value: any) => appService.updateSetting("catch", "targetMonsterId", value),
              })
            }
          >
            Ловец:
          </Button>
        </div>

        <div class="secondary-text">Пусто - текущим.</div>

        {/* <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.catch.maxCatch}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Относить",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "число",
                initialValue: settingsStore.catch.maxCatch,
                onConfirm: (value: any) => save("maxCatch", value),
              })
            }
          >
            Относить:
          </Button>
        </div>
        <div class="secondary-text">При 6 монстрах будет относить {settingsStore.catch.maxCatch} монстров в центр.</div> */}
      </>
    ),
  },
  {
    id: 31,
    title: "Погодные атаки",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.skillWeather} value={settingsStore.catch.weatherSkillId} name="weatherSkillId" onChange={(value) => appService.updateSetting("catch", "weatherSkillId", value)} />
      </div>
    ),
  },
  {
    id: 32,
    title: "Основные атаки",
    children: (
      <>
        <div class="List">
          <RadioGroup options={optionsRadioGroup.skillCatch} value={settingsStore.catch.skillId} name="skillId" onChange={(value) => appService.updateSetting("catch", "skillId", value)} />
        </div>
        <div class="secondary-text">Если выбрана атака «Блуждающие огни» или «Семена-пиявки», то при каждой успешной поимке отправляемся лечиться.</div>
      </>
    ),
  },
  {
    id: 33,
    title: "Статусные атаки",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.skillStatus} value={settingsStore.catch.statusSkillId} name="statusSkillId" onChange={(value) => appService.updateSetting("catch", "statusSkillId", value)} />
      </div>
    ),
  },
  {
    id: 34,
    title: "Монстроболы",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.monsterBall} value={settingsStore.catch.ballId} name="ballId" onChange={(value) => appService.updateSetting("catch", "ballId", value)} />
      </div>
    ),
  },
  {
    id: 35,
    title: "Пол",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.gender} value={settingsStore.catch.genderFilter} name="gender" onChange={(value) => appService.updateSetting("catch", "genderFilter", value)} />
      </div>
    ),
  },
  {
    id: 36,
    title: "Яркокрылы",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.butterfly} value={settingsStore.catch.butterflyFilter} name="butterfly" onChange={(value) => appService.updateSetting("catch", "butterflyFilter", value)} />
      </div>
    ),
  },
  {
    id: 37,
    title: "Семанты",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.semant} value={settingsStore.catch.semantFilter} name="semant" onChange={(value) => appService.updateSetting("catch", "semantFilter", value)} />
      </div>
    ),
  },
  {
    id: 38,
    title: "Шайни",
    children: (
      <>
        <div class="List">
          <Switcher title="Поимка" checked={settingsStore.catch.shine.isEnabled} onChange={(value) => appService.updateSetting("catch", "semantFilter", "shine", "isEnabled", value)} class="Item" />{" "}
        </div>

        <div class="secondary-text">Ловит всех доступных к поимки шайни, супершайни, shadow, escaped на даркбол.</div>

        <div class="List">
          <Switcher title="Супердаркбол" checked={settingsStore.catch.shine.useSuperBall} onChange={(value) => appService.updateSetting("catch", "semantFilter", "shine", "useSuperBall", value)} class="Item" />{" "}
        </div>
        <div class="secondary-text">Ловит супершайни только на супердаркбол.</div>
      </>
    ),
  },
];
