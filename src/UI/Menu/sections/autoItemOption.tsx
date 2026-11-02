import { autoItem } from "../../../testFunction/testUtils";
import { optionsRadioGroup, setSettingsStore, settingsStore } from "../../../utils/store";
import Button from "../../Component/Button";
import RadioGroup from "../../Component/Radio";

export const getAutoItemOptions = () => [
  {
    id: 99,
    title: "Автоинвентарь",
    children: (
      <div class="List">
        <RadioGroup options={optionsRadioGroup.items} value={settingsStore.autoItem} name="skillWeather" onChange={(val) => setSettingsStore("autoItem", Number(val))} />

        <Button class="Button Item cn" style={{ color: "var(--color-prime)", "margin-top": "0.25rem" }} onClick={() => autoItem()}>
          Использовать
        </Button>
      </div>
    ),
  },
];
