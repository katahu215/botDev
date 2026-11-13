import { createSignal, onMount, Show } from "solid-js";
import Button from "./UI/Component/Button";
import NavigationMenu from "./UI/Menu/Navigation";
import ModalProvider from "./UI/Component/modalService";
import { isAuthorized, validateSession } from "./utils/auth";
import { setSessionStore } from "./utils/store";

function App() {
  const [open, setOpen] = createSignal(false);
  const handleOpen = () => setOpen(!open());
  setSessionStore("isMobile", /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  onMount(() => {
    validateSession();
  });

  return (
    <>
      <ModalProvider />

      <Show when={isAuthorized()}>
        <Button iconName="bug" class="round smaller startBtn" onClick={handleOpen} />
        <NavigationMenu isOpen={open()} />
      </Show>
    </>
  );
}

export default App;
