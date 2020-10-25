import Vue from "vue";
declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $accessor: string;
  }
}

Vue.use({
  install(Vue) {
    Vue.prototype.$accessor = {};
  },
});
