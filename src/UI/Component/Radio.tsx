import { For } from "solid-js";
import type { RadioOption } from "../../utils/store";

type RadioGroupProps = {
  name: string;
  options: readonly RadioOption[];
  value: number;
  onChange: (value: number) => void;
};

const RadioGroup = (props: RadioGroupProps) => {
  return (
    <div class="Radio">
      <For each={props.options}>
        {(option) => (
          <label class="radio-label">
            <input type="radio" name={props.name} value={String(option.value)} checked={props.value === option.value} onChange={() => props.onChange(option.value)} class="radio-input" />
            <span class="radio-custom" />
            <span class="title">{option.label}</span>
          </label>
        )}
      </For>
    </div>
  );
};

export default RadioGroup;
