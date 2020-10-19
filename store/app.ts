import { Connection } from '@harmony-dev/harmony-web-sdk'
import { getterTree, mutationTree } from 'nuxt-typed-vuex'

interface IData {
  messages: {
    [messageID: string]: string
  }
}

interface IState {
  userID: string | undefined
  session: string | undefined
  host: string | undefined
  connections: {
    [host: string]: Connection
  }
  data: {
    [host: string]: IData
  }
}

export const state = (): IState => ({
  userID: undefined,
  session: undefined,
  host: undefined,
  connections: {},
  data: {},
})

export const mutations = mutationTree(state, {
  setUserID(state, userID?: string) {
    state.userID = userID
  },
  setSession(state, token?: string) {
    state.session = token
  },
  setHost(state, host?: string) {
    state.host = host
  },
})

export const getters = getterTree(state, {
  async getOrFederate(state, host: string) {
    if (!state.connections[host]) {
      const federateResp = await state.connections[state.host!].federate(host)
      state.connections[host] = new Connection(host)
      const loginResp = await state.connections[host].loginFederated(
        federateResp.message!.getToken(),
        state.host!
      )
      state.connections[host].session = loginResp.message!.getSessionToken()
    }
    return state.connections[host]
  },
})
