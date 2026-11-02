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
        {/* <div class="secondary-text">Ловит яркокрылов: {settingsStore.butterfly.includes(0) ? "всех" : settingsStore.butterfly.join(", ")}</div> */}

        <div class="List">
          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.catchMonster}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Ловец",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "id монстра",
                initialValue: settingsStore.catchMonster,
                onConfirm: (value: any) => appService.updateSettings("catchMonster", value),
              })
            }
          >
            Ловец:
          </Button>

          {/* <div class="secondary-text">Ловец должен быть с атакой Сломанный меч.</div> */}

          <Button
            class="Item values"
            iconName="pen"
            value={settingsStore.countCatch}
            onClick={() =>
              modalService.open(Confirm, {
                title: "Относить",
                noClose: true,
                showInput: true,
                isNumber: true,
                inputPlaceholder: "число",
                initialValue: settingsStore.countCatch,
                onConfirm: (value: any) => appService.updateSettings("countCatch", value),
              })
            }
          >
            Относить:
          </Button>
        </div>
        <div class="secondary-text">При 6 монстрах будет относить {settingsStore.countCatch} монстров в центр.</div>
      </>
    ),
  },
  {
    id: 31,
    title: "Погодные атаки",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.skillWeather} value={settingsStore.skillWeather} name="skillWeather" onChange={(val) => appService.updateSettings("skillWeather", val)} />
      </div>
    ),
  },
  {
    id: 32,
    title: "Основные атаки",
    children: (
      <>
        <div class="List">
          <RadioGroup options={optionsRadioGroup.skillCatch} value={settingsStore.skillCatch} name="skillCatch" onChange={(val) => appService.updateSettings("skillCatch", val)} />
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
        <RadioGroup options={optionsRadioGroup.skillStatus} value={settingsStore.skillStatus} name="skillStatus" onChange={(val) => appService.updateSettings("skillStatus", val)} />
      </div>
    ),
  },
  {
    id: 34,
    title: "Монстроболы",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.monsterBall} value={settingsStore.monsterBall} name="monsterBall" onChange={(val) => appService.updateSettings("monsterBall", val)} />
      </div>
    ),
  },
  {
    id: 35,
    title: "Пол",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.gender} value={settingsStore.gender} name="gender" onChange={(val) => appService.updateSettings("gender", val)} />
      </div>
    ),
  },
  {
    id: 36,
    title: "Яркокрылы",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.butterfly} value={settingsStore.butterfly} name="butterfly" onChange={(val) => appService.updateSettings("butterfly", val)} />
      </div>
    ),
  },
  {
    id: 37,
    title: "Семанты",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.semant} value={settingsStore.semant} name="semant" onChange={(val) => appService.updateSettings("semant", val)} />
      </div>
    ),
  },
  {
    id: 38,
    title: "Шайни",
    children: (
      <>
        <div class="List">
          <Switcher title="Поимка" checked={settingsStore.shine.catchShine} onChange={(val) => appService.updateSettings("shine", { catchShine: val })} class="Item" />{" "}
        </div>
        <div class="secondary-text">Ловит всех доступных к поимки шайни, супершайни, shadow, escaped на даркбол.</div>

        <div class="List">
          <Switcher title="Супердаркбол" checked={settingsStore.shine.useSuperBall} onChange={(val) => appService.updateSettings("shine", { useSuperBall: val })} class="Item" />{" "}
        </div>
        <div class="secondary-text">Ловит супершайни только на супердаркбол.</div>
      </>
    ),
  },
];
