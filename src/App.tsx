import { createSignal, onCleanup, onMount, Show } from "solid-js";
import Button from "./UI/Component/Button";
import NavigationMenu, { toggleNavigationMenu } from "./UI/Menu/Navigation";
import ModalProvider from "./UI/Component/modalService";
import { isAuthorized, validateSession } from "./utils/auth";
import { setSessionStore } from "./utils/store";
import { DropMenu } from "./UI/Menu/DropMenu";
import { buildClassName } from "./utils/buildClassName";

function useAnchorPosition(selector: string) {
  const [pos, setPos] = createSignal({ left: 0, top: 0 });
  const [ready, setReady] = createSignal(false);

  onMount(() => {
    const host = document.querySelector(selector);
    if (!host) return;

    const anchor = document.createElement("div");
    anchor.style.gridArea = "weather";
    anchor.style.margin = "-2px 40px 0 0";
    host.appendChild(anchor);

    let lastLeft = NaN,
      lastTop = NaN,
      pending = false;

    const update = () => {
      const r = anchor.getBoundingClientRect();
      if (r.left === lastLeft && r.top === lastTop) return;
      lastLeft = r.left;
      lastTop = r.top;
      setPos({ left: r.left, top: r.top });
      setReady(true);
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        update();
      });
    };

    update();
    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const mo = new MutationObserver(schedule);
    mo.observe(host, { childList: true, subtree: true, attributes: true });

    onCleanup(() => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
      anchor.remove();
    });
  });

  return { pos, ready };
}

function App() {
  const { pos, ready } = useAnchorPosition("#divDockButtons");
  onMount(() => validateSession());
  setSessionStore("isMobile", /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  return (
    <>
      <ModalProvider />
      <Show when={isAuthorized()}>
        <Show when={ready()}>
          <Button
            iconName="gamepad"
            class={buildClassName("round smaller startBtn", pos().top === 0 && "none")}
            onClick={() => toggleNavigationMenu()}
            style={{
              left: `${pos().left}px`,
              top: `${pos().top}px`,
            }}
          />
        </Show>
        <NavigationMenu />
        <DropMenu />
      </Show>
    </>
  );
}

export default App;
