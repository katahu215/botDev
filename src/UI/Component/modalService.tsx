import { createSignal, onMount, onCleanup } from "solid-js";
import { For } from "solid-js";

export interface ModalItem {
  id: string;
  component: (props: any) => any;
  props?: Record<string, any>;
  isOpen: () => boolean;
  setIsOpen: (v: boolean) => void;
}

const [modals, setModals] = createSignal<ModalItem[]>([]);

export const modalService = {
  get modals() {
    return modals();
  },

  open(component: ModalItem["component"], props?: Record<string, any>) {
    if (modals().find((m) => m.component === component)) return;

    const id = crypto.randomUUID();
    const [isOpen, setIsOpen] = createSignal(true);

    setModals((prev) => [...prev, { id, component, props, isOpen, setIsOpen }]);
  },

  close(id: string) {
    const modal = modals().find((m) => m.id === id);
    if (modal) {
      modal.setIsOpen(false);
    }
  },

  closeLast(initial?: boolean) {
    const list = modals();
    if (list.length > 0) {
      const topModal = list[list.length - 1];

      if (topModal.props?.freeze && !initial) return;

      this.close(topModal.id);
    }
  },

  remove: (id: string) => setModals((prev) => prev.filter((m) => m.id !== id)),
};

const ModalProvider = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (modalService.modals.length > 0) modalService.closeLast();
    }
  };

  onMount(() => window.addEventListener("keydown", handleKeyDown));
  onCleanup(() => window.removeEventListener("keydown", handleKeyDown));

  return (
    <For each={modalService.modals}>
      {(modal) => {
        const Component = modal.component;

        return <Component id={modal.id} isOpen={modal.isOpen()} onClose={() => modalService.close(modal.id)} onExit={() => modalService.remove(modal.id)} {...modal.props} />;
      }}
    </For>
  );
};

export default ModalProvider;
