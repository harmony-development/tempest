import { Module, Mutation, VuexModule } from "vuex-module-decorators";

export enum DialogType {
  ERROR,
  INFO,
}

@Module({ namespaced: true, name: "dialog" })
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
