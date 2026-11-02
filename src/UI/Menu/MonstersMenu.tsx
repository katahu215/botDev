import { For, Show, createMemo, createSignal } from "solid-js";
import type { ModalProps } from "../Component/Modal";
import { appService, monstersStore } from "../../utils/store";
import { modalService } from "../Component/modalService";
import { buildClassName } from "../../utils/buildClassName";
import Modal from "../Component/Modal";
import Input from "../Component/Input";
import { Transition } from "../Component/Transition";
import Button from "../Component/Button";
import Confirm from "../Component/Confirm";

interface Category {
  id: number;
  title: string;
}

type SubMonsterMenuProps = ModalProps & {
  monsterId: number;
};

type Monster = {
  id: number;
  name: string;
  cat: number;
};

const categories: Category[] = [
  { id: 1, title: "Редкие" },
  { id: 2, title: "Частые" },
  { id: 3, title: "Поймать" },
  { id: 4, title: "Сдаться" },
  { id: 5, title: "Атака 1" },
  { id: 6, title: "Атака 2" },
  { id: 7, title: "Атака 3" },
  { id: 8, title: "Атака 4" },
] as const;

const openSubMonsterMenu = (monsterId: number) => {
  modalService.open(SubMonsterMenu, { monsterId });
};

const MonstersMenu = (props: ModalProps) => {
  const monstersByCategory = createMemo(() => {
    const groups: Record<number, Monster[]> = {};
    for (const cat of categories) groups[cat.id] = [];

    for (const monster of Object.values(monstersStore)) {
      if (groups[monster.cat]) {
        groups[monster.cat].push(monster);
      }
    }

    return groups;
  });

  return (
    <Modal title="Монстры" draggable {...props}>
      <div class="Category">
        <div class="categoty-header">
          <Search />
          <Button
            class="Item round"
            iconName="wrench"
            onClick={() =>
              modalService.open(Confirm, {
                title: "Автонастройка",
                text: "Автоматическая настройка групп монстров",
                noClose: true,
                onConfirm: () => appService.updateAllMonster(false),
              })
            }
          />
          <Button
            class="Item round"
            iconName="broom"
            onClick={() =>
              modalService.open(Confirm, {
                title: "Сброс",
                text: "Восстановить монстров по умолчанию?",
                noClose: true,
                onConfirm: () => appService.updateAllMonster(true),
              })
            }
          />
        </div>

        <div class="category-container">
          <For each={categories}>
            {(item) => (
              <div class="category">
                <div class="category-title">{item.title}</div>
                <div class="category-content custom-scroll">
                  <For each={monstersByCategory()[item.id]}>
                    {(monster) => (
                      <Button class="Item small cn" onClick={() => openSubMonsterMenu(monster.id)}>
                        {monster.name}
                      </Button>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </Modal>
  );
};

export default MonstersMenu;

const Search = () => {
  const [searchQuery, setSearchQuery] = createSignal("");

  const searchResults = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();
    if (!query) return [];

    return Object.values(monstersStore).filter(
      (monster) => monster.name.toLowerCase().includes(query) || String(monster.id).includes(query),
    );
  });

  const handleSelectMonster = (monsterId: number) => {
    setSearchQuery("");
    openSubMonsterMenu(monsterId);
  };

  const hasQuery = () => Boolean(searchQuery().trim());

  return (
    <div class="Search">
      <Input
        class={buildClassName(hasQuery() && "search")}
        value={searchQuery()}
        onInput={setSearchQuery}
        placeholder="Имя или номер монстра..."
      />
      <Transition isOpen={hasQuery()}>
        <div class="result custom-scroll">
          <Show when={searchResults().length === 0}>
            <div class="no-results">Ничего не найдено</div>
          </Show>
          <For each={searchResults()}>
            {(monster) => (
              <Button class="Item small cn" onClick={() => handleSelectMonster(monster.id)}>
                {monster.name}
              </Button>
            )}
          </For>
        </div>
      </Transition>
    </div>
  );
};

const SubMonsterMenu = (props: SubMonsterMenuProps) => {
  const monster = () => monstersStore[props.monsterId];

  const filteredCategories = () => categories.filter((c: Category) => c.id !== monster()?.cat);

  return (
    <Modal title={`Переместить ${monster()?.name ?? ""} в`} headerClass="central" noClose={true} {...props}>
      <For each={filteredCategories()}>
        {(category) => (
          <Button
            class="Item small cn"
            onClick={() => {
              appService.updateMonster(props.monsterId, category.id);
              modalService.closeLast();
            }}
          >
            {category.title}
          </Button>
        )}
      </For>
    </Modal>
  );
};
