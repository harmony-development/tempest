import Vue from 'vue'
import { IGuildData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $guildData(host?: string, guildid?: string): IGuildData | undefined
  }
}

Vue.prototype.$guildData = function (
  this: Vue,
  host?: string,
  guildid?: string
) {
  return this.$accessor.app.data[this.$guildIconHost(host ?? this.$getHost())]
    ?.guilds[guildid || this.$route.params.guildid]
}
