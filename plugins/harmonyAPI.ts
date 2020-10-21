import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $getOrFederate(host: string): Connection
  }
}

Vue.prototype.$getOrFederate = async function (this: Vue, host: string) {
  const appState = this.$accessor.app
  if (!appState.connections[host]) {
    const federateResp = await appState.connections[appState.host!].federate(
      host
    )
    const conn = new Connection(host)
    appState.setConnection({
      host,
      connection: conn,
    })
    const loginResp = await conn.loginFederated(
      federateResp.message!.getToken(),
      appState.host!
    )
    conn.session = loginResp.message!.getSessionToken()
  }
  return appState.connections[host]
}
