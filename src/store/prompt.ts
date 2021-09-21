import { defineStore } from "pinia";

export enum PromptType {
  CONFIRMATION,
  ALERT,
}

export const usePromptState = defineStore("prompt", {
  state: () => ({
    open: false,
    type: PromptType.ALERT,
    content: undefined as string | undefined,
    resolve: undefined as undefined | (() => void),
    reject: undefined as undefined | (() => void),
  }),
  actions: {
    prompt(type: PromptType, content: string): Promise<void> {
      this.type = type;
      this.content = content;
      const promptPromise = new Promise<void>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      return promptPromise;
    },
    resolve() {
      this.open = false;
      this.resolve();
    },
    reject() {
      this.open = false;
      this.reject();
    },
  },
});
