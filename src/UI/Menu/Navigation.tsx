import Button from "../Component/Button";
import { modalService } from "../Component/modalService";
import TestModal from "./SettingMenu";
import { buildClassName } from "../../utils/buildClassName";
import MonstersMenu from "./MonstersMenu";
import { isAdmin, sessionStore, setSessionStore } from "../../utils/store";
import { mainController } from "../../game/mainContoller";
import { DropMenu } from "./DropMenu";
import { toggleSwitch } from "../../utils/toggleSwitch";
import { Show } from "solid-js";
import { autoItem, trade } from "../../testFunction/testUtils";

const NavigationMenu = (props: any) => {
  return (
    <div class={buildClassName("navigation-menu", props.isOpen && "open")}>
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
      <Button class="Item" iconName="book" onClick={() => modalService.open(DropMenu)}>
        Дроп
      </Button>
      <Show when={isAdmin()}>
        <Button class="Item" iconName="bug" onClick={() => trade()}>
          Авто-обмен
        </Button>
        <Button class="Item" iconName="bug" onClick={() => autoItem()}>
          Авто-Итем
        </Button>
      </Show>
    </div>
  );
};

export default NavigationMenu;
