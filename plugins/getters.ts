import Vue from 'vue'
import { IChannelData, IGuildData, IMessageData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $guildData(host?: string, guildid?: string): IGuildData | undefined
    $messages(
      host?: string
    ): {
      [messageID: string]: IMessageData
    }
    $channelData(host?: string, channelid?: string): IChannelData | undefined
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

Vue.prototype.$channelData = function (
  this: Vue,
  host?: string,
  channelid?: string
) {
  return this.$accessor.app.data[host ?? this.$getHost()]?.channels[
    channelid || this.$route.params.channelid
  ]
}

Vue.prototype.$messages = function (this: Vue, host?: string) {
  return this.$accessor.app.data[host ?? this.$getHost()]?.messages
}
