import { createSignal, createEffect, children, Show, type JSX } from "solid-js";
import { buildClassName } from "../../utils/buildClassName";

export interface TransitionProps {
  isOpen: boolean;
  onExited?: () => void;
  children: JSX.Element;
  class?: string;
}

export function Transition(props: TransitionProps) {
  const resolved = children(() => props.children);

  const [isVisible, setIsVisible] = createSignal(props.isOpen);
  const [isClosing, setIsClosing] = createSignal(false);
  const [isOpened, setIsOpened] = createSignal(false);

  createEffect(() => {
    if (props.isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      requestAnimationFrame(() => {
        setIsOpened(true);
      });
    } else if (isVisible()) {
      setIsOpened(false);
      setIsClosing(true);
    }
  });

  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== e.currentTarget) return;

    if (isClosing()) {
      setIsVisible(false);
      setIsClosing(false);
      props.onExited?.();
    }
  };

  return (
    <Show when={isVisible()}>
      <div
        class={buildClassName("Transition", isOpened() && "open", isClosing() && "close", props.class)}
        onTransitionEnd={handleTransitionEnd}
      >
        {resolved()}
      </div>
    </Show>
  );
}
