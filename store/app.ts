import { Connection } from '@harmony-dev/harmony-web-sdk'
import { actionTree, mutationTree } from 'nuxt-typed-vuex'
import Vue from 'vue'

interface IGuildEntry {
  guildId: string
  host: string
}

export interface IGuildData {
  name?: string
  picture?: string
  channels?: string[]
}

export interface IChannelData {
  channelName: string
  isCategory: boolean
  isVoice: boolean
}

interface IData {
  messages: {
    [messageID: string]: string
  }
  guilds: {
    [guildID: string]: IGuildData
  }
  channels: {
    [channelID: string]: IChannelData
  }
}

interface IState {
  userID: string | undefined
  session: string | undefined
  host: string | undefined
  connections: {
    [host: string]: Connection
  }
  pendingFederations: {
    [host: string]: Promise<Connection>
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
  pendingFederations: {},
  data: {},
  guildsList: undefined,
})

const ensureHost = (state: IState, host: string) => {
  if (state.data[host]) return
  Vue.set(state.data, host, {
    messages: {},
    guilds: {},
    channels: {},
  })
}

const ensureGuild = (state: IState, host: string, guildID: string) => {
  ensureHost(state, host)
  if (state.data[host].guilds[guildID]) return
  Vue.set(state.data[host].guilds, guildID, {
    name: undefined,
    channels: undefined,
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
    },
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
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    state.data[data.host].guilds[data.guildID].name = data.name
    state.data[data.host].guilds[data.guildID].picture = data.picture
  },
  setGuildChannels(
    state,
    data: {
      host: string
      guildID: string
      channels: string[]
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    state.data[data.host].guilds[data.guildID].channels = data.channels
  },
  setChannelsData(
    state,
    data: {
      host: string
      data: {
        [channelID: string]: IChannelData
      }
    },
  ) {
    ensureHost(state, data.host)
    state.data[data.host].channels = {
      ...state.data[data.host].channels,
      ...data.data,
    }
  },
  setPendingFederation(
    state,
    data: {
      host: string
      req: Promise<Connection>
    },
  ) {
    Vue.set(state.pendingFederations, data.host, data.req)
  },
  removePendingFederation(state, host: string) {
    Vue.delete(state.pendingFederations, host)
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async getGuildList() {
      if (!this.state.host) return
      return (
        await this.state.connections[this.state.host]?.getGuildList()
      ).message?.toObject()
    },
  },
)
