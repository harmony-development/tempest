import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "./index";

export enum DialogType {
  ERROR,
  INFO,
}

@Module({ namespaced: true, name: "dialog", store })
export default class Dialog extends VuexModule {
  open = false;
  type = DialogType.INFO;
  content = "";

  @Mutation openDialog(type: DialogType, content: string) {
    this.type = type;
    this.content = content;
    this.open = true;
  }

  @Mutation closeDialog() {
    this.open = false;
  }
}
