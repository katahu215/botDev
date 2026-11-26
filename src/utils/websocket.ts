import { mainController } from "../game/mainContoller";
import { catchCandy, payHalloween } from "../game/Halloween";
import { log } from "./logger";
import { setSessionStore, sessionStore, settingsStore } from "./store";
import { calculateType } from "./calculateType";

const posting = (txt: string) => {
  if (settingsStore.alerts.isEnabled) setSessionStore("isEnabled", false);
  log(txt);
};
const parseDropText = (text: string) => {
  const dictionary: Record<string, string> = {
    almanac_exp: "[d1] EXP",
    chest_variant_regular: "v1",
    chest_variant_event: "Ивентовый",
    chest_variant_regular2: "v2",
  };

  return text
    .replace(/\{\{([^}]+)\}\}/g, (_, content) => {
      const [key, val] = content.split(":").map((s: string) => s.trim());
      const template = dictionary[key];
      if (template) {
        return template.replace(/\[d1\]/g, val ?? "");
      }
      return val ?? "";
    })
    .replace(/\s+/g, " ")
    .trim();
};

(function () {
  if (!(window as any).io || !(window as any).io.Socket) return;

  const target = (window as any).io.Socket.prototype;
  const origOn = target.on;

  const wrappedOn = function (this: any, event: any, fn: any) {
    return origOn.call(this, event, function (this: any, ...args: any[]) {
      const cmd = args[0];

      /// ивентовые
      if (cmd === "Events.paintedTrainer") return fn.apply(this, args);
      //
      if (cmd === "Exp.Chat_setOnlines") return fn.apply(this, args);

      if (cmd === "Exp.Eventer_wilds") {
        const drops = args[1]?.[0]?.drop;
        const pokeId = args[1]?.[0]?.poke.sp_id;

        const currentMonsterCount = sessionStore.drops.monsters[pokeId] || 0;
        setSessionStore("drops", "monsters", pokeId, currentMonsterCount + 1);

        for (const drop of drops) {
          // console.log(drop);
          const count = drop[2];
          const name = parseDropText(drop[4]);

          const currentItemCount = sessionStore.drops.items[name] || 0;
          setSessionStore("drops", "items", name, currentItemCount + count);
        }

        return fn.apply(this, args);
      }

      if (cmd === "Exp.Chat_addPost") {
        const posts = Array.isArray(args[1]) ? args[1] : [args[1]];

        for (const post of posts) {
          if (post.is?.ad) return fn.apply(this, args);

          if (post.is?.privat && Number(post?.userFrom?.[0]) !== sessionStore.userId) {
            posting(post.txt);
            return fn.apply(this, args);
          }
          if (Number(post?.userTo?.[0]) === sessionStore.userId) {
            posting(post.txt);
            return fn.apply(this, args);
          }
          if (post?.txt?.includes(sessionStore.userName)) {
            posting(post.txt);
            return fn.apply(this, args);
          }
        }

        return fn.apply(this, args);
      }

      if (cmd === "Exp.TConds_upd") {
        const cond = args?.[1]?.[0];
        const cooldownSec = cond ? Math.max(0, cond.to - cond.from) : 3600;
        setSessionStore("itemCooldown", cooldownSec);
        return fn.apply(this, args);
      }

      console.log(event, args);
      return fn.apply(this, args);
    });
  };

  wrappedOn.toString = () => origOn.toString();

  Object.defineProperty(target, "on", {
    value: wrappedOn,
    writable: true,
    configurable: true,
    enumerable: false,
  });
})();

const updateDataFight = (data: any) => {
  if (data?.code === 400) return;

  if (data?.object?.fight) {
    const fight = data.object.fight;
    setSessionStore("battleState", fight);
    setSessionStore("activeMonster", fight.side?.I?.poke);
    setSessionStore("opponentMonster", fight.side?.H?.poke); /// не юзаеться?
    setSessionStore("isBattleFinished", fight.is_ended);
    setSessionStore("isAgroLocation", Boolean(fight.options?.agro));
  } else {
    const obj = data?.object;
    setSessionStore("battleState", obj);
    setSessionStore("activeMonster", obj?.side?.I?.poke);
    setSessionStore("opponentMonster", obj?.side?.H?.poke);
    setSessionStore("isBattleFinished", obj?.is_ended);
    setSessionStore("isAgroLocation", Boolean(obj?.options?.agro));
  }
};

const reaction: Record<string, (data: any) => void> = {
  "/do/loc/load": (data: any) => {
    const userId = Number(document.querySelector(".trainer.me")?.getAttribute("data-u-id"));
    const userName = document.querySelector(".trainer.me .label")?.textContent.trim() as string;
    setSessionStore("userId", userId);
    setSessionStore("userName", userName);
    setSessionStore("locationId", data.object.loc.id);
  },

  "/do/refresher": (data: any) => {
    if (data.object.fight) {
      updateDataFight(data);
      if (!data.object.fight.is_ended) mainController();
    }

    if (data.object?.events?.halloween?.trick && settingsStore.halloween.usePay) payHalloween();
    if (data.object?.events?.halloween?.candy && settingsStore.halloween.useCandy) catchCandy();
  },
  "/do/fight/attack": (data: any) => updateDataFight(data),
  "/do/fight/switche": (data: any) => updateDataFight(data),
  "/do/fight/surrend": (data: any) => updateDataFight(data),
  "/do/fight/useitem": (data: any) => updateDataFight(data),
  ///
  "/do/pc/farm/load": (data: any) => {
    if (sessionStore.permissions.isAdmin || sessionStore.permissions.isVip) calculateType(data);
  },
  "/do/loc/go": (data: any) => {
    setSessionStore("locationId", data.object?.loc.id);
  },
  ///
  // "/do/pc/heal/poke": (data: any) => console.log("heal", data),
  // "/do/loc/teleparena": (data: any) => console.log("heal", data),
  // "do/pc/heal/load": (data: any) => console.log("heal", data),
};

const pendingRequests = new Map<string, Array<(value: any) => void>>();

export const waitForResponse = (path: string): Promise<any> => {
  return new Promise((resolve) => {
    if (!pendingRequests.has(path)) pendingRequests.set(path, []);
    pendingRequests.get(path)?.push(resolve);
  });
};

(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const input = args[0];
    const urlString = String(typeof input === "string" ? input : input instanceof Request ? input.url : input?.toString?.() || "");

    const response = await originalFetch.apply(this, args);

    // Не трогаем запросы Firebase и Google
    if (urlString.includes("googleapis.com") || urlString.includes("firebaseio.com") || urlString.includes("google-analytics.com")) {
      return response;
    }

    const matchedPath = Array.from(pendingRequests.keys()).find((path) => urlString.includes(path)) || Object.keys(reaction).find((path) => urlString.includes(path));

    const clone = response.clone();

    clone
      .text()
      .then((text) => {
        if (!matchedPath) return;

        try {
          const jsonResponse = JSON.parse(text);

          if (reaction[matchedPath]) {
            reaction[matchedPath](jsonResponse);
          }

          if (pendingRequests.has(matchedPath)) {
            const resolvers = pendingRequests.get(matchedPath);
            pendingRequests.delete(matchedPath);
            resolvers?.forEach((resolve) => resolve(jsonResponse));
          }
        } catch (e) {
          console.error("Ошибка парсинга ответа fetch в JSON:", e);
        }
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        console.error("Ошибка чтения текста ответа fetch:", e);
      });

    return response;
  };
})();
