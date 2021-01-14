import { Connection } from '@harmony-dev/harmony-web-sdk'
import { GetGuildInvitesResponse } from '@harmony-dev/harmony-web-sdk/dist/protocol/chat/v1/guilds_pb'
import { Event } from '@harmony-dev/harmony-web-sdk/dist/protocol/chat/v1/streaming_pb'
import {
  Action,
  Attachment,
  Embed,
  Override,
  UserStatusMap,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'
import { mutationTree } from 'nuxt-typed-vuex'
import Vue from 'vue'

export const permissionsList = {
  'messages.send': -1,
  'messages.view': -1,
  'actions.trigger': -1,
  'roles.user.get': -1,
  'roles.user.manage': -1,
  'roles.manage': -1,
  'roles.get': -1,
  'permissions.manage.get': -1,
  'permissions.manage.set': -1,
  'permissions.query': -1,
  'channels.manage.create': -1,
  'channels.manage.change-information': -1,
  'channels.manage.move': -1,
  'channels.manage.delete': -1,
  'invites.view': -1,
  'invites.manage.create': -1,
  'invites.manage.delete': -1,
  'guild.manage.change-information': -1,
  'guild.manage.delete': -1,
}

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
  invites?: GetGuildInvitesResponse.Invite.AsObject[]
}

export interface IChannelData {
  channelName?: string
  isCategory?: boolean
  isVoice?: boolean
  reachedTop?: boolean
  messages?: string[]
  typing?: {
    [userid: string]: Date
  }
}

export interface IMessageData {
  authorID: string
  createdAt: number
  editedAt: number
  content: string
  embedsList: Embed.AsObject[]
  actionsList: Action.AsObject[]
  attachmentsList: Attachment.AsObject[]
  overrides?: Override.AsObject
  pending: boolean
}

export interface IUserData {
  username?: string
  avatar?: string
  status?: UserStatusMap[keyof UserStatusMap]
  bot?: boolean
}

export interface IRoleData {
  name: string
  color: number
  hoist: boolean
  pingable: boolean
  permissions:
    | {
        [id: string]: number
      }
    | undefined
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
  personas: IPersona[]
}

export enum PersonaKind {
  Plurality,
}

export interface IPersona {
  kind: PersonaKind
  name: string
  avatar: string | null
}

export const state = (): IState => ({
  userID: undefined,
  session: undefined,
  host: undefined,
  connections: {},
  data: {},
  guildsList: undefined,
  disconnections: {},
  personas: [],
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
    typing: {},
  })
}

const ensureTyping = (state: IState, host: string, channelID: string) => {
  ensureChannel(state, host, channelID)

  if (state.data[host].channels[channelID].typing) return

  Vue.set(state.data[host].channels[channelID], 'typing', {})
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
  setPersonas(state, personas: IPersona[]) {
    state.personas = personas
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
      name?: string
      picture?: string
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    if (data.name !== undefined)
      Vue.set(state.data[data.host].guilds[data.guildID], 'name', data.name)
    if (data.picture !== undefined)
      Vue.set(
        state.data[data.host].guilds[data.guildID],
        'picture',
        data.picture,
      )
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
    const channel = state.data[data.host].channels[data.channelID]
    Vue.set(channel, 'messages', [
      ...data.messages,
      ...(channel.messages || []),
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
      Vue.set(message, 'editedAt', data.updateEvent.editedAt)
    }
  },
  messageUnlocal(
    state,
    data: {
      host: string
      channelID: string
      messageID: string
      echoID: string
      attachments: Attachment.AsObject[]
    },
  ) {
    const msgsList = state.data[data.host]?.channels[data.channelID]?.messages
    const msgs = state.data[data.host]?.messages
    if (!msgsList || !msgs) return
    Vue.set(msgsList, msgsList.indexOf(data.echoID), data.messageID)
    Vue.set(msgs, data.messageID, {
      ...msgs[data.echoID],
      pending: false,
      attachmentsList: data.attachments,
    })
    Vue.delete(msgs, data.echoID)
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
    Vue.set(state.data[data.host], 'roles', {
      ...state.data[data.host].roles,
      ...data.roles,
    })
  },
  deleteMessage(
    state,
    data: {
      host: string
      channelID: string
      messageID: string
    },
  ) {
    ensureHost(state, data.host)
    const msgs = state.data[data.host].channels[data.channelID].messages
    if (!msgs) return

    Vue.delete(state.data[data.host].messages, data.messageID)
    msgs.splice(msgs.indexOf(data.messageID), 1)
  },
  deleteChannel(
    state,
    data: {
      host: string
      guildID: string
      channelID: string
    },
  ) {
    const channels = state.data[data.host]?.channels
    const channelsList = state.data[data.host]?.guilds[data.guildID]?.channels
    if (!channels || !channelsList) return
    Vue.delete(channelsList, channelsList.indexOf(data.channelID))
    Vue.delete(channels, data.channelID)
  },
  updateProfile(
    state,
    data: {
      host: string
      userid: string
      username?: string
      avatar?: string
      status?: UserStatusMap[keyof UserStatusMap]
      isBot?: boolean
    },
  ) {
    ensureHost(state, data.host)
    const user = state.data[data.host].users[data.userid]
    if (user) {
      if (data.username !== undefined) {
        user.username = data.username
      }
      if (data.avatar !== undefined) {
        user.avatar = data.avatar
      }
      if (data.status !== undefined) {
        user.status = data.status
      }
      if (data.isBot !== undefined) {
        user.bot = data.isBot
      }
    }
  },
  updateTyping(
    state,
    data: {
      host: string
      channelID: string
      userid: string
    },
  ) {
    ensureTyping(state, data.host, data.channelID)

    const typing = state.data[data.host]?.channels[data.channelID]?.typing

    if (typing) {
      Vue.set(typing, data.userid, new Date())
    }
  },
  deleteTyper(
    state,
    data: {
      host: string
      channelID: string
      userID: string
    },
  ) {
    ensureTyping(state, data.host, data.channelID)

    const typing = state.data[data.host]?.channels[data.channelID]?.typing

    if (typing) {
      Vue.delete(typing, data.userID)
    }
  },
  removeGuildFromList(
    state,
    data: {
      host: string
      guildID: string
    },
  ) {
    if (!state.guildsList) return
    Vue.delete(
      state.guildsList,
      state.guildsList.findIndex(
        (item) => item.host === data.host && item.guildId === data.guildID,
      ),
    )
  },
  setInvites(
    state,
    data: {
      host: string
      guildID: string
      invites: GetGuildInvitesResponse.Invite.AsObject[]
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    Vue.set(state.data[data.host].guilds[data.guildID], 'invites', data.invites)
  },
  deleteInvite(
    state,
    data: {
      host: string
      guildID: string
      inviteID: string
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    const idx = state.data[data.host].guilds[data.guildID].invites!.findIndex(
      (invite) => invite.inviteId === data.inviteID,
    )
    Vue.delete(state.data[data.host].guilds[data.guildID].invites!, idx)
  },
  createInvite(
    state,
    data: {
      host: string
      guildID: string
      inviteID: string
      maxUses: number
    },
  ) {
    ensureGuild(state, data.host, data.guildID)
    state.data[data.host].guilds[data.guildID].invites?.push({
      inviteId: data.inviteID,
      possibleUses: data.maxUses,
      useCount: 0,
    })
  },
  setPermissions(
    state,
    data: {
      host: string
      roleID: string
      permissions:
        | {
            [id: string]: number
          }
        | undefined
    },
  ) {
    ensureHost(state, data.host)
    Vue.set(
      state.data[data.host].roles[data.roleID],
      'permissions',
      data.permissions,
    )
  },
})
