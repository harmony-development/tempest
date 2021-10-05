import { StorageSerializers, useLocalStorage } from "@vueuse/core";

interface ISession {
  session: string;
  host: string;
  userID: string;
}

// NOTE: apparently `undefined` breaks how things are represented in the
export const session = useLocalStorage<ISession | null>("session", null, {
  // make it be able to actually serialize objects
  serializer: StorageSerializers.object,
});
