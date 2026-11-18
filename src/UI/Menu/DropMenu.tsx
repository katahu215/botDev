import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { monstersStore, sessionStore } from "../../utils/store";
import { buildClassName } from "../../utils/buildClassName";
import { makeDraggable } from "../../utils/makeDraggable";

export const [dropMenuOpen, setDropMenuOpen] = createSignal(false);
export const toggleDropMenu = () => setDropMenuOpen((v) => !v);

export const DropMenu = () => {
  const itemKeys = createMemo(() => Object.keys(sessionStore.drops.items));
  const monsterKeys = createMemo(() => Object.keys(sessionStore.drops.monsters));

  let refEl!: HTMLDivElement;

  onMount(() => makeDraggable(refEl, refEl));

  return (
    <div ref={refEl} class={buildClassName("Drops", dropMenuOpen() && "open")}>
      <div class="drops-content">
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
  );
};
