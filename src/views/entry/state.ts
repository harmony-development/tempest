import { useLocalStorage } from "@vueuse/core";

interface IServerEntry {
  name: string;
  description?: string;
  host: string;
}

export const serverList = useLocalStorage<IServerEntry[]>("serverList", [
  { name: "Default", host: "chat.harmonyapp.io" },
]);
