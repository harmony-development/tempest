import { Connection } from '@harmony-dev/harmony-web-sdk'
import {
  Action,
  Embed,
  Event,
  Message,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/core/v1/core_pb'
import { UserStatusMap } from '@harmony-dev/harmony-web-sdk/dist/protocol/profile/v1/profile_pb'
import { mutationTree } from 'nuxt-typed-vuex'
import Vue from 'vue'

interface IGuildEntry {
  guildId: string
  host: string
}

export interface IGuildData {
  name?: string
  picture?: string
  channels?: string[]
  memberList?: string[]
  roles?: string[]
}

export interface IChannelData {
  channelName?: string
  isCategory?: boolean
  isVoice?: boolean
  reachedTop?: boolean
  messages?: string[]
}

export interface IMessageData {
  authorID: string
  createdAt: number
  editedAt: number
  content: string
  embedsList: Embed.AsObject[]
  actionsList: Action.AsObject[]
  attachmentsList: Message.Attachment.AsObject[]
}

export interface IUserData {
  username?: string
  avatar?: string
  status?: UserStatusMap[keyof UserStatusMap]
}

export interface IRoleData {
  name: string
  color: number
  hoist: boolean
  pingable: boolean
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
  roles: {
    [roleID: string]: IRoleData
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
  guildSettingsOpen: boolean
}

export const state = (): IState => ({
  userID: undefined,
  session: undefined,
  host: undefined,
  connections: {},
  data: {},
  guildsList: undefined,
  disconnections: {},
  guildSettingsOpen: false,
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
      nextID: string
      previousID: string
      data: IChannelData
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    const guild = state.data[data.host].guilds[data.guildID]
    if (!guild.channels) {
      guild.channels = [data.channelID]
      return
    }
    if (!data.previousID || data.previousID === '0') {
      guild.channels.push(data.channelID)
    } else {
      guild.channels.splice(
        guild.channels.indexOf(data.previousID),
        0,
        data.channelID,
      )
    }
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
  prependChannelMessages(
    state,
    data: {
      host: string
      channelID: string
      messages: string[]
    },
  ) {
    ensureChannel(state, data.host, data.channelID)
    Vue.set(state.data[data.host].channels[data.channelID], 'messages', [
      ...data.messages,
      ...(state.data[data.host].channels[data.channelID].messages || []),
    ])
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
  editMessage(
    state,
    data: {
      host: string
      updateEvent: Event.MessageUpdated.AsObject
    },
  ) {
    const message = state.data[data.host].messages[data.updateEvent.messageId]
    if (message) {
      if (data.updateEvent.updateContent)
        Vue.set(message, 'content', data.updateEvent.content)
      if (data.updateEvent.updateAttachments)
        Vue.set(message, 'attachmentsList', data.updateEvent.attachmentsList)
      if (data.updateEvent.updateEmbeds)
        Vue.set(message, 'embedsList', data.updateEvent.embedsList)
      if (data.updateEvent.updateOverrides)
        Vue.set(message, 'overrides', data.updateEvent.overrides)
      if (data.updateEvent.updateActions)
        Vue.set(message, 'actionsList', data.updateEvent.actionsList)
    }
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
  setReachedTop(
    state,
    data: {
      host: string
      channelID: string
      reachedTop?: boolean
    },
  ) {
    ensureChannel(state, data.host, data.channelID)
    Vue.set(
      state.data[data.host].channels[data.channelID],
      'reachedTop',
      data.reachedTop,
    )
  },
  setMemberList(
    state,
    data: {
      host: string
      guildID: string
      memberList: string[]
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    Vue.set(
      state.data[data.host].guilds[data.guildID],
      'memberList',
      data.memberList,
    )
  },
  setGuildSettingsOpen(state, data: boolean) {
    state.guildSettingsOpen = data
  },
  setRolesList(
    state,
    data: {
      host: string
      guildID: string
      roles: string[]
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    Vue.set(state.data[data.host].guilds[data.guildID], 'roles', data.roles)
  },
  setRolesData(
    state,
    data: {
      host: string
      roles: {
        [roleID: string]: IRoleData
      }
    },
  ) {
    ensureHost(state, data.host)
    state.data[data.host].roles = {
      ...state.data[data.host].roles,
      ...data.roles,
    }
  },
})
