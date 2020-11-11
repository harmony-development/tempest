import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $getOrFederate(host: string): Connection
    $fetchChannelList(host: string, guildID: string): void
  }
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
