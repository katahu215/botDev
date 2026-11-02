import { createSignal, onMount, Show } from "solid-js";
import Button from "./UI/Component/Button";
import NavigationMenu from "./UI/Menu/Navigation";
import ModalProvider from "./UI/Component/modalService";
import { isAuthorized, validateSession } from "./utils/auth";

function App() {
  const [open, setOpen] = createSignal(false);
  const handleOpen = () => setOpen(!open());

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
