let originalConfirm: any = null;

export const toggleAutoConfirm = (text?: string) => {
  if (text) {
    if (!originalConfirm) originalConfirm = window.confirm;

    window.confirm = function (message: any) {
      const isTarget = String(message).includes(text);

      if (isTarget) return true;

      return originalConfirm ? originalConfirm.apply(window, arguments) : true;
    };
  } else {
    if (originalConfirm) {
      window.confirm = originalConfirm;
      originalConfirm = null;
    }
  }
};
