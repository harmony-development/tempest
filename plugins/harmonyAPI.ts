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
    appState.connections[host] = new Connection(host)
    const loginResp = await appState.connections[host].loginFederated(
      federateResp.message!.getToken(),
      appState.host!
    )
    appState.connections[host].session = loginResp.message!.getSessionToken()
  }
  return appState.connections[host]
}
