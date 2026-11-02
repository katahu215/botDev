import { delayInterface } from "./sleep";

export const toggleSwitch = async (pressed: boolean) => {
  const button = document.querySelector<HTMLElement>("#divInputButtons .btnSwitchWilds");
  const isPressed = button?.classList.contains("pressed") ?? false;

  await delayInterface();
  if (pressed !== isPressed && button) {
    // await ActionClick.handleClick("#divInputButtons .btnSwitchWilds");
    return button.click();
  }
};
