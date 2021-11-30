import { useEventListener } from "@vueuse/core";

export const useHotKeys = (handler: (ev: KeyboardEvent) => void) => {
  useEventListener("keypress", (ev) => {
    if (document.activeElement?.tagName === "INPUT") return;
    ev.preventDefault();
    handler(ev);
  });
};
