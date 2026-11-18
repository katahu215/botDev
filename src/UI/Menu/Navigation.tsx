import Button from "../Component/Button";
import { modalService } from "../Component/modalService";
import TestModal from "./SettingMenu";
import { buildClassName } from "../../utils/buildClassName";
import MonstersMenu from "./MonstersMenu";
import { sessionStore, setSessionStore } from "../../utils/store";
import { mainController } from "../../game/mainContoller";
import { toggleDropMenu } from "./DropMenu";
import { toggleSwitch } from "../../utils/toggleSwitch";
import { createSignal, Show } from "solid-js";
import { runHeal } from "../../game/Heal";
import { log } from "../../utils/logger";

const [navigationOpen, setNavigationMenuOpen] = createSignal(false);
export const toggleNavigationMenu = () => setNavigationMenuOpen((v) => !v);

const NavigationMenu = () => {
  return (
    <div class={buildClassName("navigation-menu", navigationOpen() && "open")}>
      <div class="navigation-content">
        <Button
          class="Item"
          iconName="sword"
          onClick={() => {
            if (sessionStore.isRunning) return;

            setSessionStore("isRunning", true);
            mainController();
          }}
          disable={sessionStore.isRunning}
        >
          Старт
        </Button>
        <Button
          class="Item"
          iconName="stop"
          onClick={() => {
            setSessionStore("isRunning", false);
            toggleSwitch(false);
          }}
        >
          Стоп
        </Button>
        <Button
          class="Item"
          iconName="pokemon"
          onClick={() => {
            modalService.open(MonstersMenu);
          }}
        >
          Монстры
        </Button>
        <Button
          class="Item"
          iconName="settings"
          onClick={() => {
            modalService.open(TestModal);
          }}
        >
          Настройки
        </Button>
        <Button class="Item" iconName="book" onClick={() => toggleDropMenu()}>
          Дроп
        </Button>
        <Show when={sessionStore.role.isAdmin}>
          <Button class="Item" iconName="bug" onClick={() => log("привет electron")}></Button>
          <Button class="Item" iconName="bug" onClick={() => runHeal()}>
            heal
          </Button>
        </Show>
      </div>
    </div>
  );
};

export default NavigationMenu;
