import { useLocalStorage } from "@vueuse/core";

interface IServerEntry {
	name: string
	description?: string
	host: string
}

export const serverList = useLocalStorage<IServerEntry[]>("serverList", [{ name: "default", host: "chat.harmonyapp.io" }]);
