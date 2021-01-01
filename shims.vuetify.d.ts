import { Framework } from 'vuetify'

declare module 'vue/types/vue' {
  // this.$vuetify inside Vue components
  interface Vue {
    $vuetify: Framework
  }
}
