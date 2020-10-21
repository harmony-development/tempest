import { Connection } from '@harmony-dev/harmony-web-sdk'
import { mutationTree } from 'nuxt-typed-vuex'
import Vue from 'vue'

interface IGuildEntry {
  guildId: string
  host: string
}

export interface IGuildData {
  name: string
  picture?: string
}

interface IData {
  messages: {
    [messageID: string]: string
  }
  guilds: {
    [guildID: string]: IGuildData
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
  guildsList: IGuildEntry[] | undefined
}

export const state = (): IState => ({
  userID: undefined,
  session: undefined,
  host: undefined,
  connections: {},
  data: {},
  guildsList: undefined,
})

const addHost = (state: IState, host: string) => {
  Vue.set(state.data, host, {
    messages: {},
    guilds: {},
  })
}

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
  setConnection(
    state,
    data: {
      host: string
      connection: Connection
    }
  ) {
    state.connections[data.host] = data.connection
    Vue.set(state.connections, data.host, data.connection)
  },
  setGuildList(state, list: IGuildEntry[]) {
    state.guildsList = list
  },
  addGuildToList(state, entry: IGuildEntry) {
    state.guildsList?.push(entry)
  },
  setGuildData(
    state,
    data: {
      host: string
      guildID: string
      name: string
      picture?: string
    }
  ) {
    if (!state.data[data.host]) addHost(state, data.host)
    Vue.set(state.data[data.host].guilds, data.guildID, {
      name: data.name,
      picture: data.picture,
    })
  },
})
