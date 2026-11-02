import { For } from "solid-js";
import type { RadioOption } from "../../utils/store";

type CheckboxGroupProps = {
  name?: string;
  options: readonly RadioOption[];
  value: number[];
  onChange: (value: number[]) => void;
};

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const isChecked = (optionValue: number) => {
    return props.value.includes(optionValue);
  };

  const handleChange = (optionValue: number, checked: boolean) => {
    let currentValue = [...props.value];

    if (optionValue === 0) {
      // Если кликнули на 0: сбрасываем всё и оставляем только [0]
      if (checked) currentValue = [0];
    } else {
      // Если кликнули на 1, 2, 3 и т.д.
      if (checked) {
        // Убираем 0 из массива (если он там был) и добавляем новое значение
        currentValue = currentValue.filter((v) => v !== 0);
        currentValue.push(optionValue);
      } else {
        // Убираем снятое значение
        currentValue = currentValue.filter((v) => v !== optionValue);
      }
    }
    // Если в итоге ничего не осталось выбранным, возвращаем 0 по умолчанию
    if (currentValue.length === 0) currentValue = [0];

    props.onChange(currentValue);
  };

  return (
    <div class="Checkbox">
      <For each={props.options}>
        {(option) => (
          <label class="checkbox-label">
            <input type="checkbox" name={props.name} value={String(option.value)} checked={isChecked(option.value)} onChange={(e) => handleChange(option.value, e.currentTarget.checked)} class="checkbox-input" />
            <span class="checkbox-custom" />
            <span class="title">{option.label}</span>
          </label>
        )}
      </For>
    </div>
  );
};

export default CheckboxGroup;
