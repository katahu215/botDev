import { autoItem } from "../../../game/utils/autoItem";
import { optionsRadioGroup, setSettingsStore, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import RadioGroup from "../../Component/Radio";

export const getAutoItemOptions = () => [
  {
    id: 99,
    title: "Автоинвентарь",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.items} value={settingsStore.automation.autoItemId} name="skillWeather" onChange={(val) => setSettingsStore("automation", { autoItemId: Number(val) })} />

        <Button class="Button Item cn" style={{ color: "var(--color-prime)", "margin-top": "0.25rem" }} onClick={() => autoItem()}>
          Использовать
        </Button>
      </div>
    ),
  },
];
