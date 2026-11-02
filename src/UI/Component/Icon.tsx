import { buildClassName } from "../../utils/buildClassName";

type IconProps = {
  name?: string;
};

const Icon = (props: IconProps) => {
  return <span class={buildClassName("icon", `icon-${props.name}`)} aria-hidden="true"></span>;
};

export default Icon;
