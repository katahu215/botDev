import type { ModalProps } from "../../UI/Component/Modal";
import Modal from "../../UI/Component/Modal";
import { modalService } from "../../UI/Component/modalService";
import { delay } from "../../utils/sleep";

// Главная точка входа: проверяем наличие капчи на странице
export const resolveCaptcha = async () => {
  const container = document.querySelector("#divFightCaptcha");
  if (!container) return true;

  if (window.getComputedStyle(container).display !== "none") {
    return await handleCaptchaDom("a3625740612803efd17abad460f54ff0");
  }

  return true;
};

// Запрос решения у внешнего API сервиса капч
const requestCaptchaSolution = async ({ sitekey, pageurl, apiKey }: { sitekey: string; pageurl: string; apiKey: string }) => {
  if (!apiKey) return { success: false, error: "API key is missing" };

  try {
    const createRes = await fetch("https://api.capmonster.cloud/createTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientKey: apiKey,
        task: {
          type: "NoCaptchaTaskProxyless",
          websiteURL: pageurl,
          websiteKey: sitekey,
        },
      }),
    });

    const createData = await createRes.json();
    if (createData.errorId !== 0) {
      const errMessage = `Ошибка создания задачи: ${createData.errorCode || "неизвестно"}`;
      console.error(`[CapMonster] ${errMessage}`);
      return { success: false, error: errMessage };
    }

    const taskId = createData.taskId;
    console.log(`[CapMonster] Задача создана (ID: ${taskId}). Ожидание решения...`);

    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const resultRes = await fetch("https://api.capmonster.cloud/getTaskResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientKey: apiKey,
          taskId: taskId,
        }),
      });

      const resultData = await resultRes.json();

      if (resultData.status === "ready" && resultData.solution) {
        return { success: true, token: resultData.solution.gRecaptchaResponse };
      }

      if (resultData.status === "error") {
        const errMessage = `Ошибка сервиса: ${resultData.errorDescription || "неизвестно"}`;
        console.error(`[CapMonster] ${errMessage}`);
        return { success: false, error: errMessage };
      }
    }
    return { success: false, error: "Timeout" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const handleCaptchaDom = async (apiKey: string) => {
  const iframe = document.querySelector("#divFightCaptcha iframe") as HTMLIFrameElement;
  if (!iframe || !iframe.src) return false;

  try {
    const urlObj = new URL(iframe.src);
    const sitekey = urlObj.searchParams.get("k");
    const pageurl = window.location.href;

    if (!sitekey) return false;

    modalService.open(CaptchaModal, { freeze: true });

    const response = await requestCaptchaSolution({
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

        await dispatchGoogleCallback(response.token);
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

// Запуск колбэков reCAPTCHA в глобальном объекте
const dispatchGoogleCallback = async (token: string) => {
  try {
    const cfg = (window as any).___grecaptcha_cfg;
    if (cfg && cfg.clients) {
      const clientIds = Object.keys(cfg.clients);
      for (let i = 0; i < clientIds.length; i++) {
        const client = cfg.clients[clientIds[i]];
        executeCallbackRecursively(client, token);
      }
    }
  } catch (e) {
    console.error("Ошибка при поиске грекапча-колбэка:", e);
  }

  await delay(400, 400);
};

// Рекурсивный поиск callback-функций внутри инстансов виджета
const executeCallbackRecursively = (obj: any, token: string, depth = 0) => {
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
        executeCallbackRecursively(val, token, depth + 1);
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
