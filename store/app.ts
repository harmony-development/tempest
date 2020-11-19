import { Connection } from '@harmony-dev/harmony-web-sdk'
import {
  Action,
  Embed,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/core/v1/core_pb'
import { UserStatusMap } from '@harmony-dev/harmony-web-sdk/dist/protocol/profile/v1/profile_pb'
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
  channelName?: string
  isCategory?: boolean
  isVoice?: boolean
  messages?: string[]
}

export interface IMessageData {
  authorID: string
  createdAt: number
  editedAt: number
  content: string
  embedsList: Embed.AsObject[]
  actionsList: Action.AsObject[]
  attachmentsList: string[]
}

export interface IUserData {
  username?: string
  avatar?: string
  status?: UserStatusMap[keyof UserStatusMap]
}

interface IData {
  messages: {
    [messageID: string]: IMessageData
  }
  guilds: {
    [guildID: string]: IGuildData
  }
  channels: {
    [channelID: string]: IChannelData
  }
  users: {
    [userID: string]: IUserData
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
  disconnections: {
    [host: string]: string
  }
}

export const state = (): IState => ({
  userID: undefined,
  session: undefined,
  host: undefined,
  connections: {},
  data: {},
  guildsList: undefined,
  disconnections: {},
})

const ensureHost = (state: IState, host: string) => {
  if (state.data[host]) return
  Vue.set(state.data, host, {
    messages: {},
    guilds: {},
    channels: {},
    users: {},
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

const ensureChannel = (state: IState, host: string, channelID: string) => {
  ensureHost(state, host)
  if (state.data[host].channels[channelID]) return
  Vue.set(state.data[host].channels, channelID, {
    channelName: undefined,
    isCategory: undefined,
    isVoice: undefined,
    messages: undefined,
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
    Object.keys(data.data).forEach((key) => {
      if (!state.data[data.host].channels[key]) {
        Vue.set(state.data[data.host].channels, key, data.data[key])
        return
      }
      Vue.set(
        state.data[data.host].channels[key],
        'channelName',
        data.data[key].channelName,
      )
      Vue.set(
        state.data[data.host].channels[key],
        'isVoice',
        data.data[key].isVoice,
      )
      Vue.set(
        state.data[data.host].channels[key],
        'isCategory',
        data.data[key].isCategory,
      )
    })
  },
  addChannel(
    state,
    data: {
      host: string
      guildID: string
      channelID: string
      data: IChannelData
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    if (!state.data[data.host].guilds[data.guildID].channels) {
      state.data[data.host].guilds[data.guildID].channels = [data.channelID]
      return
    }
    state.data[data.host].guilds[data.guildID].channels?.push(data.channelID)
    state.data[data.host].channels[data.channelID] = data.data
  },
  setChannelMessages(
    state,
    data: {
      host: string
      channelID: string
      messages: string[]
    },
  ) {
    ensureChannel(state, data.host, data.channelID)
    Vue.set(
      state.data[data.host].channels[data.channelID],
      'messages',
      data.messages,
    )
  },
  setMessagesData(
    state,
    data: {
      host: string
      data: {
        [messageID: string]: IMessageData
      }
    },
  ) {
    ensureHost(state, data.host)
    state.data[data.host].messages = {
      ...state.data[data.host].messages,
      ...data.data,
    }
  },
  addMessage(
    state,
    data: {
      host: string
      channelID: string
      messageID: string
      data: IMessageData
    },
  ) {
    ensureChannel(state, data.host, data.channelID)
    state.data[data.host].messages[data.messageID] = data.data
    state.data[data.host].channels[data.channelID].messages?.push(
      data.messageID,
    )
  },
  setUser(
    state,
    data: {
      host: string
      userID: string
      data: IUserData
    },
  ) {
    ensureHost(state, data.host)
    Vue.set(state.data[data.host]?.users, data.userID, data.data)
  },
  setDisconnected(
    state,
    data: {
      host: string
      message: string
    },
  ) {
    Vue.set(state.disconnections, data.host, data.message)
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
