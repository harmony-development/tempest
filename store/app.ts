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
import { Store } from './store'

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
  unread?: boolean
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

export enum PersonaKind {
  Plurality,
}

export interface IPersona {
  kind: PersonaKind
  name: string
  avatar: string | null
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

class AppState extends Store<IState> {
  getHost(host: string) {
    if (this.state.data[host]) return this.state.data[host]
    this.state.data[host] = {
      messages: {},
      guilds: {},
      channels: {},
      users: {},
      roles: {},
    }
    return this.state.data[host]
  }

  getGuild(host: string, guildID: string) {
    const data = this.getHost(host)
    if (data.guilds[guildID]) return data.guilds[guildID]
    data.guilds[guildID] = {
      name: undefined,
      channels: undefined,
    }

    return data.guilds[guildID]
  }

  getChannel(host: string, channelID: string) {
    const data = this.getHost(host)
    if (data.channels[channelID]) return data.channels[channelID]
    data.channels[channelID] = {
      channelName: undefined,
      isCategory: undefined,
      isVoice: undefined,
      messages: undefined,
      typing: {},
    }
    return data.channels[channelID]
  }

  setGuildData(host: string, guildID: string, name?: string, picture?: string) {
    const guild = this.getGuild(host, guildID)
    if (name) guild.name = name
    if (picture) guild.picture = picture
  }

  setGuildChannels(host: string, guildID: string, channels: string[]) {
    const guild = this.getGuild(host, guildID)
    guild.channels = channels
  }

  setChannelData(
    host: string,
    channels: {
      [channelID: string]: IChannelData
    }
  ) {
    const data = this.getHost(host)
    for (const [channelID, channel] of Object.entries(channels)) {
      data.channels[channelID] = {
        ...data.channels[channelID],
        ...channel,
      }
    }
  }

  addChannel(
    host: string,
    guildID: string,
    channelID: string,
    _nextID: string,
    previousID: string,
    data: IChannelData
  ) {
    const guild = this.getGuild(host, guildID)
    if (!guild.channels) guild.channels = []
    if (!previousID || previousID === '0') {
      guild.channels.push(channelID)
    } else {
      guild.channels.splice(guild.channels.indexOf(previousID), 0, channelID)
    }
    this.setChannelData(host, {
      [channelID]: data,
    })
  }

  setChannelMesseages(host: string, channelID: string, messages: string[]) {
    const channel = this.getChannel(host, channelID)
    channel.messages = messages
  }

  prependChannelMessages(host: string, channelID: string, messages: string[]) {
    const channel = this.getChannel(host, channelID)
    channel.messages = [...messages, ...(channel.messages || [])]
  }

  setMessagesData(
    host: string,
    messages: {
      [messageID: string]: IMessageData
    }
  ) {
    const data = this.getHost(host)
    data.messages = {
      ...data.messages,
      ...messages,
    }
  }

  addMessage(
    host: string,
    channelID: string,
    messageID: string,
    data: IMessageData
  ) {
    const channel = this.getChannel(host, channelID)
    channel.messages?.push(messageID)
    this.setMessagesData(host, {
      [messageID]: data,
    })
  }

  editMessage(host: string, updateEvent: Event.MessageUpdated.AsObject) {
    const message = this.getHost(host).messages[updateEvent.messageId]
    if (!message) return // if the message isn't even loaded then why bother updating it?
    if (updateEvent.updateContent) message.content = updateEvent.content
    if (updateEvent.updateAttachments)
      message.attachmentsList = updateEvent.attachmentsList
    if (updateEvent.updateEmbeds) message.embedsList = updateEvent.embedsList
    if (updateEvent.updateOverrides) message.overrides = updateEvent.overrides
    if (updateEvent.updateActions) message.actionsList = updateEvent.actionsList
    message.editedAt = updateEvent.editedAt!.seconds
  }

  messageUnlocal(
    host: string,
    channelID: string,
    messageID: string,
    echoID: string,
    attachments: Attachment.AsObject[]
  ) {
    const hostData = this.getHost(host)
    const channelData = this.getChannel(host, channelID)
    const msgsList = channelData.messages
    const msgs = hostData.messages
    if (!msgsList || !msgs) return
    msgsList[msgsList.indexOf(echoID)] = messageID
    msgs[messageID] = {
      ...msgs[echoID],
      pending: false,
      attachmentsList: attachments,
    }
    delete msgs[echoID]
  }

  setUser(host: string, userID: string, data: IUserData) {
    const hostData = this.getHost(host)
    hostData.users[userID] = data
  }

  setDisconnected(host: string, message: string) {
    this.state.disconnections[host] = message
  }

  setReachedTop(host: string, channelID: string, reachedTop?: boolean) {
    const channel = this.getChannel(host, channelID)
    channel.reachedTop = reachedTop
  }

  setMemberList(host: string, guildID: string, memberList: string[]) {
    const guildData = this.getGuild(host, guildID)
    guildData.memberList = memberList
  }

  setRolesList(host: string, guildID: string, roles: string[]) {
    const guildData = this.getGuild(host, guildID)
    guildData.roles = roles
  }

  setRolesData(
    host: string,
    roles: {
      [roleID: string]: IRoleData
    }
  ) {
    const hostData = this.getHost(host)
    hostData.roles = {
      ...hostData.roles,
      ...roles,
    }
  }

  deleteMessage(host: string, channelID: string, messageID: string) {
    const hostData = this.getHost(host)
    const channelData = this.getChannel(host, channelID)
    const msgs = channelData.messages
    if (!msgs) return

    delete hostData.messages[messageID]
    msgs.splice(msgs.indexOf(messageID), 1)
  }

  deleteChannel(host: string, guildID: string, channelID: string) {
    const hostData = this.getHost(host)
    const guild = this.getGuild(host, guildID)
    const channels = hostData.channels
    const channelsList = guild.channels
    if (!channelsList) return
    delete channelsList[channelsList.indexOf(channelID)]
    delete channels[channelID]
  }

  updateProfile(
    host: string,
    userid: string,
    username?: string,
    avatar?: string,
    status?: UserStatusMap[keyof UserStatusMap],
    isBot?: boolean
  ) {
    const hostData = this.getHost(host)
    const user = hostData.users[userid]
    if (user) {
      if (username !== undefined) {
        user.username = username
      }
      if (avatar !== undefined) {
        user.avatar = avatar
      }
      if (status !== undefined) {
        user.status = status
      }
      if (isBot !== undefined) {
        user.bot = isBot
      }
    }
  }

  updateTyping(host: string, channelID: string, userid: string) {
    const channel = this.getChannel(host, channelID)

    if (!channel.typing) channel.typing = {}

    channel.typing[userid] = new Date()
  }

  deleteTyper(host: string, channelID: string, userID: string) {
    const channel = this.getChannel(host, channelID)

    if (!channel.typing) channel.typing = {}

    delete channel.typing[userID]
  }

  removeGuildFromList(host: string, guildID: string) {
    if (!this.state.guildsList) return
    delete this.state.guildsList[
      this.state.guildsList.findIndex(
        (item) => item.host === host && item.guildId === guildID
      )
    ]
  }

  setInvites(
    host: string,
    guildID: string,
    invites: GetGuildInvitesResponse.Invite.AsObject[]
  ) {
    const guildData = this.getGuild(host, guildID)
    guildData.invites = invites
  }

  deleteInvite(host: string, guildID: string, inviteID: string) {
    const guildData = this.getGuild(host, guildID)
    const idx = guildData.invites!.findIndex(
      (invite) => invite.inviteId === inviteID
    )
    delete guildData.invites?.[idx]
  }

  createInvite(
    host: string,
    guildID: string,
    inviteID: string,
    maxUses: number
  ) {
    const guildData = this.getGuild(host, guildID)
    guildData.invites?.push({
      inviteId: inviteID,
      possibleUses: maxUses,
      useCount: 0,
    })
  }

  setPermissions(
    host: string,
    roleID: string,
    permissions:
      | {
          [id: string]: number
        }
      | undefined
  ) {
    const hostData = this.getHost(host)
    hostData.roles[roleID].permissions = permissions
  }

  markAsRead(host: string, channelID: string) {
    const channelData = this.getChannel(host, channelID)
    channelData.unread = false
  }

  setAuthDetails(userID: string, sessionToken: string, host: string) {
    this.state.userID = userID
    this.state.session = sessionToken
    this.state.host = host
    localStorage.setItem('userid', userID)
    localStorage.setItem('session', sessionToken)
    localStorage.setItem('host', host)
  }
}

export const appState: AppState = new AppState({
  userID: undefined,
  session: undefined,
  host: undefined,
  connections: {},
  data: {},
  guildsList: undefined,
  disconnections: {},
  personas: [],
})
