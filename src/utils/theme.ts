import { appContainer } from "..";

export const toggleTheme = () => {
  const current = appContainer.dataset.theme === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";

  appContainer.dataset.theme = next;
  localStorage.setItem("theme", next);

  return next;
};
