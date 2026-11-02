import { onMount, Show } from "solid-js";
import { makeDraggable } from "../../utils/makeDraggable";
import { buildClassName } from "../../utils/buildClassName";
import { Transition } from "./Transition";
import Button from "./Button";

export type ModalProps = {
  id: string;
  isOpen: boolean;
  children: any;
  title?: any;
  headerClass?: string;
  draggable?: boolean;
  freeze?: boolean;
  noClose?: boolean;
  onClose?: () => void;
  onExit?: () => void;
  onBack?: (() => void) | null;
};

const Modal = (props: ModalProps) => {
  let refEl!: HTMLDivElement;
  let refHandle!: HTMLDivElement;

  props.draggable && onMount(() => makeDraggable(refEl, refHandle));

  const isBack = () => typeof props.onBack === "function";

  const handleClose = () => {
    if (props.freeze) return;

    if (isBack() && props.onBack) {
      props.onBack();
    } else if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div class={buildClassName("Modal", props.draggable && "dragging")}>
      <Show when={!props.draggable}>
        <div class="backdrop" onClick={handleClose} />
      </Show>
      <Transition isOpen={props.isOpen} onExited={props.onExit} class="modal">
        <div ref={refEl} class="modal-container">
          <div class="modal-dialog">
            <div class={buildClassName("header", props.headerClass)}>
              <Show when={!props.noClose}>
                <Button class="round close" iconName={buildClassName(isBack() ? "arrow-left" : "close")} onClick={handleClose} />
              </Show>
              <div ref={refHandle} class="title">
                {props.title}
              </div>
            </div>
            <div class="content custom-scroll">{props.children}</div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Modal;
