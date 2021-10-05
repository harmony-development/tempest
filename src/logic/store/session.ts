import { useLocalStorage } from "@vueuse/core";

interface ISession {
  session: string;
  host: string;
  userID: string;
}

export const session = useLocalStorage<ISession | undefined>(
  "session",
  undefined
);
