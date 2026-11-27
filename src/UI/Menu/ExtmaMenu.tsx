import { createMemo, createSignal } from "solid-js";
import Button from "../Component/Button";
import { VirtualSlider } from "../Component/Slider";
import Modal from "../Component/Modal";
import { getNotificationOptions } from "./sections/notificationOptions";
import Switcher from "../Component/Switcher";
import { appService, settingsStore } from "../../utils/store";
import { getTimerOptions } from "./sections/timerOptions";

export type ExtraMenuProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  title?: string;
};
export const ExtraMenu = (props: ExtraMenuProps) => {
  const [history, setHistory] = createSignal<number[]>([0]);

  const pushScreen = (id: number) => setHistory((prev) => [...prev, id]);
  const popScreen = () => setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const options = [
    {
      id: 0,
      title: "Дополнительно",
      children: (
        <div class="List">
          <Button class="Item" onClick={() => pushScreen(40)} iconName="bell">
            Уведомления
          </Button>
          <Button class="Item" onClick={() => pushScreen(105)} iconName="timer">
            Отключение
          </Button>
          <Switcher title="Ночной режим" checked={settingsStore.isDarkTheme} onChange={(value) => appService.updateSetting("isDarkTheme", value)} class="Item" />
        </div>
      ),
    },
    ...getNotificationOptions(),
    ...getTimerOptions(),
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
