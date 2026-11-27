import { createSignal, Show } from "solid-js";
import Button from "./Button";
import Input from "./Input";
import Modal, { type ModalProps } from "./Modal";

export type ConfirmProps = ModalProps & {
  onConfirm: (value?: number) => void;
  showInput?: boolean;
  text?: string;
  inputPlaceholder?: string;
  initialValue?: number;
};

const Confirm = (props: ConfirmProps) => {
  const initialDisplay = props.initialValue ? String(props.initialValue) : "";
  const [inputValue, setInputValue] = createSignal(initialDisplay);

  const handleConfirm = (e?: Event) => {
    e?.preventDefault();
    props.onConfirm(props.showInput ? Number(inputValue()) || 0 : undefined);
    props.onClose?.();
  };

  const handleClose = () => props.onClose?.();

  return (
    <Modal {...props} onClose={handleClose}>
      <div class="Confirm">
        <div class="List">
          <Show when={props.text}>
            <div style={{ "text-align": "center", padding: "0.25rem", "font-size": "var(--font-x-small)" }}>{props.text}</div>
          </Show>
          <form onSubmit={handleConfirm} class="confirm-content">
            <Show when={props.showInput}>
              <Input value={inputValue()} onInput={setInputValue} placeholder={props.inputPlaceholder} isNumber />
            </Show>

            <div class="button-container">
              <Button type="submit" class="Item">
                Подтвердить
              </Button>
              <Button class="Item" onClick={handleClose}>
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default Confirm;
