import Vue from "vue";
import Vuex from "vuex";
import Dialog from "./dialog";
import Entry from "./entry";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    entry: Entry,
    dialog: Dialog,
  },
});
