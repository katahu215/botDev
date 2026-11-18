export const makeDraggable = (el: HTMLElement, handle: HTMLElement) => {
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  let currentX = 0;
  let currentY = 0;

  let minDx = 0;
  let maxDx = 0;
  let minDy = 0;
  let maxDy = 0;

  let activeDx = 0;
  let activeDy = 0;

  handle.style.cursor = "grab";
  // Важно для мобильных устройств, чтобы браузер не скроллил страницу при драге
  handle.style.touchAction = "none";

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isDragging = true;
    handle.setPointerCapture(e.pointerId);

    startX = e.clientX;
    startY = e.clientY;
    activeDx = 0;
    activeDy = 0;

    const rect = el.getBoundingClientRect();

    // Исправлены знаки минус для границ экрана
    minDx = -rect.left + currentX;
    maxDx = window.innerWidth - rect.right + currentX;
    minDy = -rect.top + currentY;
    maxDy = window.innerHeight - rect.bottom + currentY;

    el.style.transition = "none";
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;

    // Предотвращаем дефолтный скролл страницы на мобилках
    e.preventDefault();

    handle.style.cursor = "grabbing";

    const rawDx = e.clientX - startX;
    const rawDy = e.clientY - startY;

    activeDx = Math.min(Math.max(rawDx, minDx - currentX), maxDx - currentX);
    activeDy = Math.min(Math.max(rawDy, minDy - currentY), maxDy - currentY);

    const x = currentX + activeDx;
    const y = currentY + activeDy;

    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;

    handle.style.cursor = "grab";
    isDragging = false;

    currentX += activeDx;
    currentY += activeDy;

    try {
      handle.releasePointerCapture(e.pointerId);
    } catch {}
  };

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove, { passive: false });
  handle.addEventListener("pointerup", onPointerUp);
  handle.addEventListener("pointercancel", onPointerUp);
};
