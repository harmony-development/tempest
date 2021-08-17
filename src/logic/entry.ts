import { useLocalStorage } from "@vueuse/core";

interface IHostEntry {
  host: string;
  name: string;
}

const defaultHostList: IHostEntry[] = [
  {
    name: "Harmony",
    host: "chat.harmonyapp.io",
  },
];

export const hostList = useLocalStorage("hostlist", defaultHostList);
