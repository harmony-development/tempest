import Vue from "vue";
import Vuex from "vuex";
import * as dialog from "./dialog";
import * as entry from "./entry";
import * as app from "./app";
import { useAccessor } from "typed-vuex";

Vue.use(Vuex);

const storePattern = {
  modules: {
    entry,
    dialog,
    app,
  },
};

const store = new Vuex.Store(storePattern);
const accessor = useAccessor(store, storePattern);

Vue.prototype.$accessor = useAccessor(store, storePattern);

declare module "vue/types/vue" {
  interface Vue {
    $accessor: typeof accessor;
  }
}

export default store;
