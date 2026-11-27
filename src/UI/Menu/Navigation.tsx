import Button from "../Component/Button";
import { modalService } from "../Component/modalService";
import TestModal from "./SettingMenu";
import { buildClassName } from "../../utils/buildClassName";
import MonstersMenu from "./MonstersMenu";
import { sessionStore, setSessionStore } from "../../utils/store";
import { mainController } from "../../game/mainContoller";
import { toggleDropMenu } from "./DropMenu";
import { createSignal, Show } from "solid-js";
import { shutdownGame } from "../../utils/shutdownGame";
import { heal } from "../../game/heal";
import { toggleSwitch } from "../../game/utils/toggleSwitch";

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
            if (sessionStore.isEnabled) return;

            setSessionStore("isEnabled", true);
            mainController();
          }}
          disable={sessionStore.isEnabled}
        >
          Старт
        </Button>
        <Button
          class="Item"
          iconName="stop"
          onClick={() => {
            setSessionStore("isEnabled", false);
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
        <Show when={sessionStore.permissions.isAdmin}>
          <Button class="Item" iconName="bug" onClick={() => shutdownGame()}></Button>
          <Button class="Item" iconName="bug" onClick={() => heal()}>
            Хил
          </Button>
        </Show>
      </div>
    </div>
  );
};

export default NavigationMenu;
