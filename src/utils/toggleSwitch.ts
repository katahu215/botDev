import { delayInterface } from "./sleep";
import { sessionStore } from "./store";

export const toggleSwitch = async (pressed: boolean) => {
  let button = null;

  if (sessionStore.isMobile) {
    button = document.querySelector<HTMLElement>("#divDockUpper .btnSwitchWilds");
  } else {
    button = document.querySelector<HTMLElement>("#divInputButtons .btnSwitchWilds");
  }

  const isPressed = button?.classList.contains("pressed") ?? false;

  await delayInterface();
  if (pressed !== isPressed && button) {
    // await ActionClick.handleClick("#divInputButtons .btnSwitchWilds");
    return button.click();
  }
};
