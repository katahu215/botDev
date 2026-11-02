import Button from "./Button";
import { buildClassName } from "../../utils/buildClassName";

type SwitcherProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  title?: string;
  class?: string;
};

const Switcher = (props: SwitcherProps) => {
  const handleToggle = () => props.onChange?.(!props.checked);

  return (
    <label class={buildClassName("Switcher", props.class)}>
      <Button onClick={handleToggle}>{props.title}</Button>

      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange?.(e.currentTarget.checked)} />

      <span class="widget" />
    </label>
  );
};

export default Switcher;
