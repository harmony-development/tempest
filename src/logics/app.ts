import { useLocalStorage } from "@vueuse/core";

export const host = useLocalStorage("host", "https://chat.harmonyapp.io:2289");
export const session = useLocalStorage<string | undefined>(
  "session",
  undefined
);
export const userID = useLocalStorage<number | undefined>("userid", undefined);

export const isLoggedIn = () => {
  return !!host && !!session && !!userID;
};
