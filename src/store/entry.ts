import { Module, VuexModule } from "vuex-module-decorators";

export interface IServerEntry {
  name: string;
  host: string;
}

@Module({ namespaced: true, name: "entry" })
export default class Entry extends VuexModule {
  serverList: IServerEntry[] = [];
  selectedServer: string | undefined;
  step = 1;
}
