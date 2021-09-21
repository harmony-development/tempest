import { defineStore } from "pinia";

export const useDialogState = defineStore("dialogs", {
  state: () => ({
    userSettings: false,
  }),
});
