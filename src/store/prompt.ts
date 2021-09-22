import { Store } from "./store";

export enum PromptType {
  CONFIRMATION,
  ALERT,
}

interface IPromptState {
  promptOpen: boolean;
  promptType: PromptType;
  content?: string;
  resolve?: () => void;
  reject?: () => void;
}

class PromptState extends Store<IPromptState> {
  async prompt(type: PromptType, content: string): Promise<void> {
    this.state.promptType = type;
    this.state.content = content;
    const promptPromise = new Promise<void>((resolve, reject) => {
      this.state.resolve = resolve;
      this.state.reject = reject;
    });
    return promptPromise;
  }

  resolve() {
    this.state.promptOpen = false;
    this.state.resolve?.();
  }

  reject() {
    this.state.promptOpen = false;
    this.state.reject?.();
  }
}

export const promptState = new PromptState({
  promptOpen: false,
  promptType: PromptType.ALERT,
});
