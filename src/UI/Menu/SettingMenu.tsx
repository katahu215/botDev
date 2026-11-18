import { createMemo, createSignal, type JSX } from "solid-js";
import Modal from "../Component/Modal";
import { VirtualSlider } from "../Component/Slider";
import Button from "../Component/Button";
import { getFightOptions } from "./sections/fightOption";
import { getLvlUpOptions } from "./sections/lvlUpOptions";
import { getCatchOptions } from "./sections/catchOptions";
import { getNotificationOptions } from "./sections/notificationOptions";
import { getHealOptions } from "./sections/healOptions";
import { getAutoItemOptions } from "./sections/autoItemOptions";
import { getHalloweenOptions } from "./sections/halloweenOptions";

export type TestModalProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  title?: string;
};

const TestModal = (props: TestModalProps): JSX.Element => {
  const [history, setHistory] = createSignal<number[]>([0]);

  const pushScreen = (id: number) => setHistory((prev) => [...prev, id]);
  const popScreen = () => setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const options = [
    {
      id: 0,
      title: "Настройки",
      children: (
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(1)} iconName="sword">
            Бои
          </Button>
          <Button class="Item" onClick={() => pushScreen(20)} iconName="lvlUp">
            Прокачка
          </Button>
          <Button class="Item" onClick={() => pushScreen(30)} iconName="fishing">
            Ловля
          </Button>
          <Button class="Item" onClick={() => pushScreen(100)} iconName="heal">
            Лечение
          </Button>
          <Button class="Item" onClick={() => pushScreen(99)} iconName="auto-item">
            Автоинвентарь
          </Button>
          <Button class="Item" onClick={() => pushScreen(40)} iconName="bell">
            Уведомления
          </Button>

          {/* <Button class="Item" onClick={() => pushScreen(110)} iconName="ghost">
            Хэллоуин
          </Button> */}
        </div>
      ),
    },
    //
    ...getFightOptions(pushScreen),
    ...getLvlUpOptions(pushScreen),
    ...getCatchOptions(pushScreen),
    ...getNotificationOptions(),
    ...getHealOptions(),
    ...getAutoItemOptions(),
    ...getHalloweenOptions(),
  ];
  const activeScreen = createMemo(() => options.find((opt) => opt.id === history()[history().length - 1]));
  const handleTitle = createMemo(() => activeScreen()?.title);
  const handleBack = () => (history().length > 1 ? popScreen() : props.onClose());

  return (
    <Modal {...props} title={handleTitle()} draggable onBack={history().length > 1 ? handleBack : undefined}>
      <VirtualSlider history={history()} options={options} />
    </Modal>
  );
};

export default TestModal;
