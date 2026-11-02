import { createEffect, createSignal, onCleanup, type JSX } from "solid-js";

export type SlideOption = {
  id: number;
  children: JSX.Element;
};

type StackSliderProps = {
  history: number[];
  options: SlideOption[];
};

export const VirtualSlider = (props: StackSliderProps) => {
  const [prevHistory, setPrevHistory] = createSignal<number[]>(props.history);
  const [leavingId, setLeavingId] = createSignal<number | null>(null);
  const [direction, setDirection] = createSignal<"forward" | "backward" | "">("");

  // Анимируем только высоту
  const [height, setHeight] = createSignal<string>("auto");

  let enteringRef!: HTMLDivElement;
  let leavingRef!: HTMLDivElement;
  let timer: ReturnType<typeof setTimeout> | null = null;

  createEffect(() => {
    const currentStack = props.history;
    const oldStack = prevHistory();

    const currentId = currentStack[currentStack.length - 1];
    const oldId = oldStack[oldStack.length - 1];

    if (currentId === oldId) return;

    const isForward = currentStack.length >= oldStack.length;

    setLeavingId(oldId);
    setDirection(isForward ? "forward" : "backward");

    // Замеряем только высоту уходящего и входящего слайдов
    requestAnimationFrame(() => {
      if (!enteringRef || !leavingRef) return;

      const oldHeight = leavingRef.scrollHeight;
      const newHeight = enteringRef.scrollHeight;

      // 1. Фиксируем стартовую высоту уходящего слайда
      setHeight(`${oldHeight}px`);

      // 2. На следующем кадре запускаем переход к новой высоте
      requestAnimationFrame(() => {
        setHeight(`${newHeight}px`);
      });
    });

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setLeavingId(null);
      setDirection("");
      setPrevHistory(currentStack);
      // Возвращаем auto для динамического изменения высоты внутри слайда
      setHeight("auto");
    }, 300);
  });

  onCleanup(() => {
    if (timer) clearTimeout(timer);
  });

  const activeId = () => props.history[props.history.length - 1];

  const renderSlide = (id: number) => props.options.find((opt) => opt.id === id)?.children;

  return (
    <div
      class={`Slider ${direction()}`}
      style={{
        height: height(),
      }}
    >
      <div ref={enteringRef} class="slide entering">
        {renderSlide(activeId())}
      </div>

      {leavingId() !== null && (
        <div ref={leavingRef} class="slide leaving">
          {renderSlide(leavingId()!)}
        </div>
      )}
    </div>
  );
};
