import { Show } from "solid-js";
import Icon from "./Icon";
import { buildClassName } from "../../utils/buildClassName";

type ButtonProps = {
  class?: string;
  children?: any;
  iconName?: string;
  style?: any;
  value?: number | string;
  type?: "button" | "submit";
  disable?: boolean;
  onClick?: (e: MouseEvent) => void;
};
const Button = (props: ButtonProps) => {
  return (
    <button class={buildClassName("Button", props.class, props.disable && "disable")} style={props.style} disabled={props.disable} onClick={props.onClick} type={props.type ? props.type : "button"}>
      <Show when={props.iconName}>
        <Icon name={props.iconName} />
      </Show>
      {props.children}
      <Show when={props.value}>
        <span class="value">{props.value}</span>
      </Show>
    </button>
  );
};

export default Button;
