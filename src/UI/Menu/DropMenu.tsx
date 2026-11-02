import { createMemo, createSignal, For, Show } from "solid-js";

import { sessionStore } from "../../utils/store";
import { monstersStore } from "../../utils/store";
import Modal, { type ModalProps } from "../Component/Modal";

export const [openDrop, setOpenDrop] = createSignal(false);

export const DropMenu = (props: ModalProps) => {
  const itemKeys = createMemo(() => Object.keys(sessionStore.drops.items));
  const monsterKeys = createMemo(() => Object.keys(sessionStore.drops.monsters));

  return (
    <Modal title="Дроп" draggable {...props}>
      <div class="Drops">
        <div class="List">
          <Show
            when={itemKeys().length || monsterKeys().length}
            fallback={
              <div style={{ color: "var(--color-secondary)" }} class="Item">
                Пусто
              </div>
            }
          >
            <For each={itemKeys()}>
              {(name) => (
                <div class="Item">
                  {name} x{sessionStore.drops.items[name]}
                </div>
              )}
            </For>

            <div style={{ "border-bottom": "1px solid #0000000d" }}></div>

            <For each={monsterKeys()}>
              {(pokeId: any) => {
                const monster = monstersStore[pokeId];
                return (
                  <div class="Item">
                    {monster ? monster.name : `Неизвестный ${pokeId}`} x{sessionStore.drops.monsters[pokeId]}
                  </div>
                );
              }}
            </For>
          </Show>
        </div>
      </div>
    </Modal>
  );
};
