import { createMemo, createSignal, For, Show } from "solid-js";
import { settingsStore, setSettingsStore, optionsRadioGroup, appService } from "../../utils/store";
import Button from "../Component/Button";
import { modalService } from "../Component/modalService";
import Confirm from "../Component/Confirm";
import Modal from "../Component/Modal";
import { VirtualSlider } from "../Component/Slider";
import RadioGroup from "../Component/Radio";
import Switcher from "../Component/Switcher";
import { unwrap } from "solid-js/store";

type ComboKey = keyof typeof settingsStore.combo;

type EditingStepRef = {
  slot: ComboKey;
  index: number;
};

const COMBO_SLOTS: ComboKey[] = [1, 2, 3, 4];
const DEFAULT_ATTACK_ID = 1;
const DEFAULT_ATTACK_STATUS = 0;
const DEFAULT_ATTACK_ATTEMPTS = 100;
const DEFAULT_SWAP_ID = 0;

const resolveAttackId = (id: number | undefined): number => id ?? DEFAULT_ATTACK_ID;
const resolveAttackStatus = (status: number | undefined): number => status ?? DEFAULT_ATTACK_STATUS;
const resolveAttackAttempts = (attempts: number | undefined): number => attempts ?? DEFAULT_ATTACK_ATTEMPTS;
const resolveSwapId = (id: number | undefined): number => id ?? DEFAULT_SWAP_ID;

const addStep = (slot: ComboKey, type: "attack" | "swap") => {
  const step =
    type === "attack"
      ? {
          type: "attack" as const,
          id: DEFAULT_ATTACK_ID,
          status: DEFAULT_ATTACK_STATUS,
          attempts: DEFAULT_ATTACK_ATTEMPTS,
        }
      : { type: "swap" as const, id: DEFAULT_SWAP_ID };

  setSettingsStore("combo", slot, "steps", (prev) => [...prev, step]);
};

const removeStep = (slot: ComboKey, index: number) => {
  setSettingsStore("combo", slot, "steps", (prev) => prev.filter((_, i) => i !== index));
};

export type ComboMenuProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  title?: string;
};

export const ComboMenu = (props: ComboMenuProps) => {
  const [history, setHistory] = createSignal<number[]>([40]);
  const [editingAttack, setEditingAttack] = createSignal<EditingStepRef | null>(null);

  const pushScreen = (id: number) => setHistory((prev) => [...prev, id]);
  const popScreen = () => setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const openAttackEditor = (slot: ComboKey, index: number) => {
    setEditingAttack({ slot, index });
    pushScreen(45);
  };

  const options = [
    {
      id: 40,
      title: "Комбо",
      children: (
        <div class="List">
          <div>
            <For each={COMBO_SLOTS}>
              {(slotId) => (
                <Button iconName="route" class="Item" onClick={() => pushScreen(40 + slotId)}>
                  Комбо №{slotId}
                </Button>
              )}
            </For>
          </div>
        </div>
      ),
    },
    {
      id: 41,
      title: "Комбо №1",
      children: <ComboStep slot={1} onEditAttack={(idx) => openAttackEditor(1, idx)} />,
    },
    {
      id: 42,
      title: "Комбо №2",
      children: <ComboStep slot={2} onEditAttack={(idx) => openAttackEditor(2, idx)} />,
    },
    {
      id: 43,
      title: "Комбо №3",
      children: <ComboStep slot={3} onEditAttack={(idx) => openAttackEditor(3, idx)} />,
    },
    {
      id: 44,
      title: "Комбо №4",
      children: <ComboStep slot={4} onEditAttack={(idx) => openAttackEditor(4, idx)} />,
    },
    {
      id: 45,
      title: "Настройка атаки",
      children: <Show when={editingAttack()}>{(target) => <ComboAttack slot={target().slot} stepIndex={target().index} onOpenStatus={() => pushScreen(46)} />}</Show>,
    },
    {
      id: 46,
      title: "Статусы",
      children: <Show when={editingAttack()}>{(target) => <ComboAttackStatus slot={target().slot} stepIndex={target().index} />}</Show>,
    },
  ];

  const activeScreen = createMemo(() => options.find((opt) => opt.id === history()[history().length - 1]));
  const handleTitle = createMemo(() => activeScreen()?.title);
  const handleBack = () => (history().length > 1 ? popScreen() : props.onClose());

  return (
    <Modal {...props} title={handleTitle()} draggable onBack={history().length > 1 ? handleBack : undefined}>
      <VirtualSlider history={history()} options={options} />
    </Modal>
  );
};

const ComboStep = (props: { slot: ComboKey; onEditAttack: (index: number) => void }) => {
  const handleSwapConfirm = (stepIndex: number) => (val?: number) => {
    setSettingsStore("combo", props.slot, "steps", stepIndex, (prev) => (prev.type === "swap" ? { ...prev, id: val ?? DEFAULT_SWAP_ID } : prev));
  };

  const handleHealChange = (checked: boolean) => {
    setSettingsStore("combo", props.slot, "isHeal", checked);
  };

  const handleSave = () => {
    appService.updateSetting("combo", String(props.slot), {
      steps: unwrap(settingsStore.combo[props.slot].steps),
      isHeal: settingsStore.combo[props.slot].isHeal,
    });
  };

  return (
    <div class="Combo">
      <For each={settingsStore.combo[props.slot].steps}>
        {(step, index) => (
          <div class="List">
            <Show
              when={step.type === "swap"}
              fallback={
                <Button iconName="list" class="Item" onClick={() => props.onEditAttack(index())}>
                  {step.type === "attack" ? `Атака ${resolveAttackId(step.id)} попыток: ${resolveAttackAttempts(step.attempts)}` : ""}
                </Button>
              }
            >
              <Button
                class="Item values"
                iconName="pen"
                value={resolveSwapId(step.type === "swap" ? step.id : DEFAULT_SWAP_ID)}
                onClick={() =>
                  modalService.open(Confirm, {
                    title: "Сменить",
                    noClose: true,
                    showInput: true,
                    isNumber: true,
                    inputPlaceholder: "id монстра",
                    initialValue: resolveSwapId(step.type === "swap" ? step.id : DEFAULT_SWAP_ID),
                    onConfirm: handleSwapConfirm(index()),
                  })
                }
              >
                Сменить на:
              </Button>
            </Show>
            <Button iconName="broom" class="Item icon" onClick={() => removeStep(props.slot, index())} />
          </div>
        )}
      </For>

      <div class="List buttons-container">
        <Button class="Item" onClick={() => addStep(props.slot, "attack")}>
          + Атака
        </Button>
        <Button class="Item" onClick={() => addStep(props.slot, "swap")}>
          + Смена
        </Button>
      </div>
      <div class="List" style={"display:block"}>
        <Switcher title="Лечится после комбо" checked={settingsStore.combo[props.slot].isHeal} onChange={handleHealChange} class="Item" />
      </div>
      <Button iconName="save" class="Item cn prime" onClick={handleSave}>
        Сохранить
      </Button>
    </div>
  );
};

const ComboAttack = (props: { slot: ComboKey; stepIndex: number; onOpenStatus: () => void }) => {
  const step = () => settingsStore.combo[props.slot].steps[props.stepIndex];

  const currentAttempts = () => {
    const s = step();
    return s && s.type === "attack" ? resolveAttackAttempts(s.attempts) : DEFAULT_ATTACK_ATTEMPTS;
  };

  const currentSkillId = () => {
    const s = step();
    return s && s.type === "attack" ? resolveAttackId(s.id) : DEFAULT_ATTACK_ID;
  };
  const currentStatusLabel = () => {
    const s = step();
    const status = s && s.type === "attack" ? resolveAttackStatus(s.status) : DEFAULT_ATTACK_STATUS;
    return optionsRadioGroup.skillCombo.find((item) => Number(item.value) === status)?.label ?? "";
  };

  const handleAttemptsConfirm = (val?: number) => {
    setSettingsStore("combo", props.slot, "steps", props.stepIndex, (prev) => (prev.type === "attack" ? { ...prev, attempts: val ?? DEFAULT_ATTACK_ATTEMPTS } : prev));
  };

  const handleSkillChange = (value: string | number) => {
    const skillId = Number(value);
    setSettingsStore("combo", props.slot, "steps", props.stepIndex, (prev) => (prev.type === "attack" ? { ...prev, id: skillId } : prev));
  };

  return (
    <>
      <div class="List">
        <Button
          class="Item values"
          iconName="pen"
          value={currentAttempts()}
          onClick={() =>
            modalService.open(Confirm, {
              title: "Количество атак:",
              noClose: true,
              showInput: true,
              isNumber: true,
              inputPlaceholder: "число",
              initialValue: currentAttempts(),
              onConfirm: handleAttemptsConfirm,
            })
          }
        >
          Количество атак:
        </Button>
      </div>
      <div class="List">
        <RadioGroup options={optionsRadioGroup.finishSkill} value={currentSkillId()} name={`attackSkill-${props.slot}-${props.stepIndex}`} onChange={handleSkillChange} />
      </div>
      <div class="List">
        <Button class="Item" value={currentStatusLabel()} iconName="list" onClick={props.onOpenStatus}>
          Статусы
        </Button>
      </div>
      {currentStatusLabel() !== "Не использовать" && <div class="secondary-text">Укажите номер атаки «{currentStatusLabel()}»</div>}
    </>
  );
};

//

const ComboAttackStatus = (props: { slot: ComboKey; stepIndex: number }) => {
  const step = () => settingsStore.combo[props.slot].steps[props.stepIndex];

  const currentStatus = () => {
    const s = step();
    return s && s.type === "attack" ? resolveAttackStatus(s.status) : DEFAULT_ATTACK_STATUS;
  };

  const handleStatusChange = (value: string | number) => {
    const statusId = Number(value);
    setSettingsStore("combo", props.slot, "steps", props.stepIndex, (prev) => (prev.type === "attack" ? { ...prev, status: statusId } : prev));
  };

  return (
    <div class="List">
      <RadioGroup options={optionsRadioGroup.skillCombo} value={currentStatus()} name={`skillCombo-${props.slot}-${props.stepIndex}`} onChange={handleStatusChange} />
    </div>
  );
};
