import { appService, optionsRadioGroup, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import CheckboxGroup from "../../Component/CheckBox";
import Confirm from "../../Component/Confirm";
import { modalService } from "../../Component/modalService";
import RadioGroup from "../../Component/Radio";
import Switcher from "../../Component/Switcher";

const save = (param: string, value: any) => appService.updateSettings("catch", { [param]: value });
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
                onConfirm: (value: any) => appService.updateSettings("catch", { targetMonsterId: value }),
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
        <RadioGroup options={optionsRadioGroup.skillWeather} value={settingsStore.catch.weatherSkillId} name="weatherSkillId" onChange={(val) => appService.updateSettings("catch", { weatherSkillId: val })} />
      </div>
    ),
  },
  {
    id: 32,
    title: "Основные атаки",
    children: (
      <>
        <div class="List">
          <RadioGroup options={optionsRadioGroup.skillCatch} value={settingsStore.catch.skillId} name="skillId" onChange={(val) => appService.updateSettings("catch", { skillId: val })} />
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
        <RadioGroup options={optionsRadioGroup.skillStatus} value={settingsStore.catch.statusSkillId} name="statusSkillId" onChange={(val) => appService.updateSettings("catch", { statusSkillId: val })} />
      </div>
    ),
  },
  {
    id: 34,
    title: "Монстроболы",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.monsterBall} value={settingsStore.catch.ballId} name="ballId" onChange={(val) => appService.updateSettings("catch", { ballId: val })} />
      </div>
    ),
  },
  {
    id: 35,
    title: "Пол",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.gender} value={settingsStore.catch.genderFilter} name="gender" onChange={(val) => appService.updateSettings("catch", { genderFilter: val })} />
      </div>
    ),
  },
  {
    id: 36,
    title: "Яркокрылы",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.butterfly} value={settingsStore.catch.butterflyFilter} name="butterfly" onChange={(val) => appService.updateSettings("catch", { butterflyFilter: val })} />
      </div>
    ),
  },
  {
    id: 37,
    title: "Семанты",
    children: (
      <div class="List">
        <CheckboxGroup options={optionsRadioGroup.semant} value={settingsStore.catch.semantFilter} name="semant" onChange={(val) => save("semantFilter", val)} />
      </div>
    ),
  },
  {
    id: 38,
    title: "Шайни",
    children: (
      <>
        <div class="List">
          <Switcher
            title="Поимка"
            checked={settingsStore.catch.shine.isEnabled}
            onChange={(val) => appService.updateSettings("catch", { ...settingsStore.catch, shine: { ...settingsStore.catch.shine, isEnabled: val } })}
            class="Item"
          />{" "}
        </div>
        <div class="secondary-text">Ловит всех доступных к поимки шайни, супершайни, shadow, escaped на даркбол.</div>

        <div class="List">
          <Switcher
            title="Супердаркбол"
            checked={settingsStore.catch.shine.useSuperBall}
            onChange={(val) => appService.updateSettings("catch", { ...settingsStore.catch, shine: { ...settingsStore.catch.shine, useSuperBall: val } })}
            class="Item"
          />{" "}
        </div>
        <div class="secondary-text">Ловит супершайни только на супердаркбол.</div>
      </>
    ),
  },
];
