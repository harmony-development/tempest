import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'
import { IChannelData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $getHost(): string
    $getOrFederate(host: string): Connection
    $fetchChannelList(host: string, guildID: string): void
  }
}

Vue.prototype.$getHost = function (this: Vue) {
  return this.$route.hash.substr(1).replace('///', '//')
}

Vue.prototype.$getOrFederate = function (this: Vue, host: string) {
  const appState = this.$accessor.app
  if (appState.connections[host]) return appState.connections[host]
  if (appState.pendingFederations[host])
    return appState.pendingFederations[host]
  const process = async () => {
    const federateResp = await appState.connections[appState.host!].federate(
      host,
    )
    const conn = new Connection(host)
    appState.setConnection({
      host,
      connection: conn,
    })
    const loginResp = await conn.loginFederated(
      federateResp.message!.getToken(),
      appState.host!,
    )
    conn.session = loginResp.message!.getSessionToken()
    this.$accessor.app.setConnection({
      host,
      connection: conn,
    })
    this.$accessor.app.removePendingFederation(host)
    return appState.connections[host]
  }
  appState.pendingFederations[host] = process()
  return appState.pendingFederations[host]
}

Vue.prototype.$fetchChannelList = async function (
  this: Vue,
  host: string,
  guildID: string,
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildChannels(guildID)
  const asObj = resp.message?.toObject()

  const mapped = asObj!.channelsList.reduce<{
    [channelID: string]: IChannelData
  }>((prev, val) => {
    Vue.set(prev, val.channelId, {
      channelName: val.channelName,
      isCategory: val.isCategory,
      isVoice: val.isVoice,
    })
    return prev
  }, {})

  this.$accessor.app.setGuildChannels({
    host,
    guildID: this.$route.params.guildid,
    channels: asObj!.channelsList.map((c) => c.channelId),
  })
  this.$accessor.app.setChannelsData({
    host,
    data: mapped,
  })
}
