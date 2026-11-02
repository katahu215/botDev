import { type JSX } from "solid-js";
import { buildClassName } from "../../utils/buildClassName";

type InputProps = {
  value?: string;
  onInput?: (value: string) => void;
  onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;
  onBlur?: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>;
  onKeyDown?: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;

  title?: string;
  placeholder?: string;
  class?: string;
  type?: string;
  isNumber?: boolean;
};

const Input = (props: InputProps) => {
  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    let val = e.currentTarget.value;

    if (props.isNumber) {
      val = val.replace(/\D/g, "");
      e.currentTarget.value = val;
    }

    props.onInput?.(val);
  };

  return (
    <div class={buildClassName("Input", props.class)}>
      <input
        value={props.value}
        onInput={handleInput}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        placeholder={props.placeholder}
        class={props.class}
        type={props.type ?? "text"}
      />
    </div>
  );
};

export default Input;
