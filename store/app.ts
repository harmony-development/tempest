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
  channels: string[]
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
    channels: {},
  })
}

const addGuild = (state: IState, host: string, guildID: string) => {
  Vue.set(state.data[host].guilds, guildID, {
    name: '',
    channels: [],
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
  setGuildChannels(
    state,
    data: {
      host: string
      guildID: string
      channels: string[]
    }
  ) {
    if (!state.data[data.host]) addHost(state, data.host)
    if (!state.data[data.guildID]) addGuild(state, data.host, data.guildID)
    state.data[data.host].guilds[data.guildID].channels = data.channels
  },
  setChannelsData(
    state,
    data: {
      host: string
      guildID: string
      data: {
        [channelID: string]: IChannelData
      }
    }
  ) {
    if (!state.data[data.host]) addHost(state, data.host)
    state.data[data.host].channels = {
      ...state.data[data.host].channels,
      ...data.data,
    }
  },
})
