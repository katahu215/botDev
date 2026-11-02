import type { ModalProps } from "../UI/Component/Modal";
import Modal from "../UI/Component/Modal";
import { modalService } from "../UI/Component/modalService";
import { delay } from "./sleep";

export const solveCaptcha = async () => {
  const el = document.querySelector("#divFightCaptcha");
  if (!el) return true;

  if (window.getComputedStyle(el).display !== "none") return await handleCaptcha("a3625740612803efd17abad460f54ff0");

  return true;
};

const handleCaptcha = async (apiKey: string) => {
  const el = document.querySelector("#divFightCaptcha iframe") as HTMLIFrameElement;
  if (!el || !el.src) return false;

  try {
    const urlObj = new URL(el.src);
    const sitekey = urlObj.searchParams.get("k");
    const pageurl = window.location.href;

    if (!sitekey) return false;

    // открываем уведомление
    modalService.open(CaptchaModal, { freeze: true });

    const response = await (window as any).ssevsType.triggerCaptcha({
      sitekey,
      pageurl,
      apiKey,
    });

    if (response && response.success && response.token) {
      const textarea = document.querySelector("#g-recaptcha-response") as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = response.token;

        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));

        await triggerGoogleCallback(response.token);
        return true;
      } else {
        return false;
      }
    } else {
      console.error("Ошибка решения капчи:", response?.error || "Неизвестная ошибка");
      return false;
    }
  } catch (error) {
    console.error("Ошибка при обработке капчи:", error);
    return false;
  } finally {
    modalService.closeLast(true);
  }
};

const triggerGoogleCallback = async (token: string) => {
  try {
    const cfg = (window as any).___grecaptcha_cfg;
    if (cfg && cfg.clients) {
      const clientIds = Object.keys(cfg.clients);
      for (let i = 0; i < clientIds.length; i++) {
        const client = cfg.clients[clientIds[i]];
        findAndExecuteCallback(client, token);
      }
    }
  } catch (e) {
    console.error("Ошибка при поиске грекапча-колбэка:", e);
  }

  await delay(400, 400);
};
const findAndExecuteCallback = (obj: any, token: string, depth = 0) => {
  if (!obj || depth > 5) return;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === "function" && (key === "callback" || key === "l")) {
        try {
          val(token);
        } catch (err) {
          console.error("Ошибка выполнения callback:", err);
        }
      } else if (typeof val === "object" && val !== null) {
        findAndExecuteCallback(val, token, depth + 1);
      }
    }
  }
};

const CaptchaModal = (props: ModalProps) => {
  return (
    <Modal title="Капча" noClose {...props}>
      <div style={{ "text-align": "center" }}>Решение капчи...</div>
    </Modal>
  );
};
