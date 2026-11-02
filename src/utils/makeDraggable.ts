export const makeDraggable = (el: HTMLElement, handle: HTMLElement) => {
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Текущее накопленное смещение
  let currentX = 0;
  let currentY = 0;

  // Кэш допустимых смещений (чтобы не читать DOM в pointermove)
  let minDx = 0;
  let maxDx = 0;
  let minDy = 0;
  let maxDy = 0;

  // Фактическое смещение в текущем кадре
  let activeDx = 0;
  let activeDy = 0;

  handle.style.cursor = "grab";

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isDragging = true;
    handle.setPointerCapture(e.pointerId);

    startX = e.clientX;
    startY = e.clientY;
    activeDx = 0;
    activeDy = 0;

    // ОПТИМИЗАЦИЯ: Считаем границы окна только один раз при старте драга.
    // getBoundingClientRect() дорогая операция, ей не место в pointermove.
    const rect = el.getBoundingClientRect();

    // Вычисляем, на сколько пикселей можно сдвинуть элемент до краев экрана
    minDx = -rect.left; // сколько пикселей до левого края
    maxDx = window.innerWidth - rect.right; // сколько до правого
    minDy = -rect.top; // сколько до верхнего
    maxDy = window.innerHeight - rect.bottom; // сколько до нижнего

    el.style.transition = "none";
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    handle.style.cursor = "grabbing";

    // Сырая дельта от курсора
    const rawDx = e.clientX - startX;
    const rawDy = e.clientY - startY;

    // Ограничиваем дельту вычисленными границами с помощью Math.min/max
    activeDx = Math.min(Math.max(rawDx, minDx), maxDx);
    activeDy = Math.min(Math.max(rawDy, minDy), maxDy);

    // Итоговые координаты
    const x = currentX + activeDx;
    const y = currentY + activeDy;

    // Используем translate3d для аппаратного ускорения
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;

    handle.style.cursor = "grab";
    isDragging = false;

    // Фиксируем именно ограниченную дельту, а не позицию мыши,
    // чтобы не было скачка, если мышь ушла за пределы окна
    currentX += activeDx;
    currentY += activeDy;

    try {
      handle.releasePointerCapture(e.pointerId);
    } catch {}
  };

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.addEventListener("pointercancel", onPointerUp);
};
