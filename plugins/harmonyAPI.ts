import { Connection } from '@harmony-dev/harmony-web-sdk'
import {
  Action,
  Embed,
  UserStatusMap,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'
import Vue from 'vue'
import { IChannelData, IMessageData, IRoleData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $getHost(): string
    $getOrFederate(host: string): Promise<Connection>
    $addGuildToList(host: string, guildID: string): void
    $fetchChannelList(host: string, guildID: string): void
    $fetchMessageList(
      host: string,
      guildID: string,
      channelID: string,
      lastMessageID?: string,
    ): void
    $createChannel(host: string, guildID: string, channelName: string): void
    $sendMessage(
      host: string,
      guildID: string,
      channelID: string,
      content?: string,
      attachments?: string[],
      echoID?: number,
    ): void
    $uploadFile(host: string, file: File): Promise<string>
    $fetchUser(host: string, userID: string): void
    $fetchMemberList(host: string, guildID: string): void
    $fetchGuildRoles(host: string, guildID: string): void
    $updateProfile(
      host: string,
      data: {
        newUsername?: string
        newAvatar?: string
        newStatus?: UserStatusMap[keyof UserStatusMap]
        newIsBot?: boolean
      },
    ): void
    $deleteMessage(
      host: string,
      guildID: string,
      channelID: string,
      messageID: string,
    ): void
    $editMessage(
      host: string,
      guildID: string,
      channelID: string,
      messageID: string,
      newContent?: string,
      newAttachments?: string[],
      newActions?: Action[],
      newEmbeds?: Embed[],
    ): void
    $deleteChannel(host: string, guildID: string, channelID: string): void
    $sendTyping(host: string, guildID: string, channelID: string): void
    $leaveGuild(host: string, guildID: string): void
  }
}

const pendingFederations: {
  [host: string]: Promise<Connection>
} = {}

const pendingUserFetches: {
  [userID: string]: boolean
} = {}

Vue.prototype.$getHost = function (this: Vue) {
  return decodeURIComponent(this.$route.hash.substr(1))
}

Vue.prototype.$getOrFederate = function (this: Vue, host: string) {
  if (!host) host = this.$accessor.app.host!
  const appState = this.$accessor.app
  if (appState.connections[host]) return appState.connections[host]
  if (pendingFederations[host]) return pendingFederations[host]
  const process = async () => {
    const federateResp = await appState.connections[appState.host!].federate(
      host,
    )
    const conn = new Connection(host)
    appState.setConnection({
      host,
      connection: conn,
    })
    const loginResp = await conn.loginFederated(
      federateResp.message!.getToken(),
      appState.host!.replace('https://', ''),
    )
    conn.session = loginResp.message!.getSessionToken()
    this.$accessor.app.setConnection({
      host,
      connection: conn,
    })
    delete pendingFederations[host]
    this.$bindEvents(conn)
    conn.beginStream()
    return appState.connections[host]
  }
  pendingFederations[host] = process()
  return pendingFederations[host]
}

Vue.prototype.$addGuildToList = function (
  this: Vue,
  host: string,
  guildID: string,
) {
  if (!this.$accessor.app.host) return
  return this.$accessor.app.connections[
    this.$accessor.app.host
  ].addGuildToGuildList(guildID, host)
}

Vue.prototype.$fetchChannelList = async function (
  this: Vue,
  host: string,
  guildID: string,
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildChannels(guildID)
  const asObj = resp.message?.toObject()

  const mapped = asObj!.channelsList.reduce<{
    [channelID: string]: IChannelData
  }>((prev, val) => {
    Vue.set(prev, val.channelId, {
      channelName: val.channelName,
      isCategory: val.isCategory,
      isVoice: false,
    })
    return prev
  }, {})

  this.$accessor.app.setGuildChannels({
    host,
    guildID: this.$route.params.guildid,
    channels: asObj!.channelsList.map((c) => c.channelId),
  })
  this.$accessor.app.setChannelsData({
    host,
    data: mapped,
  })
}

Vue.prototype.$fetchMessageList = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  lastMessageID?: string,
) {
  const conn = await this.$getOrFederate(host)

  const resp = await conn.getChannelMessages(guildID, channelID, lastMessageID)
  const asObj = resp.message?.toObject()

  const mapped = asObj!.messagesList.reduce<{
    [messageID: string]: IMessageData
  }>((prev, val) => {
    Vue.set(prev, val.messageId, {
      authorID: val.authorId,
      createdAt: val.createdAt?.seconds || 0,
      editedAt: val.editedAt?.seconds || 0,
      content: val.content,
      embedsList: val.embedsList,
      actionsList: val.actionsList,
      attachmentsList: val.attachmentsList,
      overrides: val.overrides,
      pending: false,
    })
    return prev
  }, {})
  const reachedTop = asObj!.reachedTop

  if (lastMessageID) {
    this.$accessor.app.prependChannelMessages({
      host,
      channelID,
      messages: asObj!.messagesList.map((m) => m.messageId).reverse(),
    })
    this.$accessor.app.setReachedTop({
      host,
      channelID,
      reachedTop,
    })
  } else {
    this.$accessor.app.setChannelMessages({
      host,
      channelID,
      messages: asObj!.messagesList.map((c) => c.messageId).reverse(),
    })
  }
  this.$accessor.app.setMessagesData({
    host,
    data: mapped,
  })
}

Vue.prototype.$createChannel = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelName: string,
) {
  const conn = await this.$getOrFederate(host)
  await conn.createChannel(guildID, channelName)
}

Vue.prototype.$sendMessage = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  content?: string,
  attachments?: string[],
  echoID?: number,
) {
  const conn = await this.$getOrFederate(host)
  return conn.sendMessage(
    guildID,
    channelID,
    content,
    attachments,
    undefined,
    undefined,
    echoID,
  )
}

Vue.prototype.$uploadFile = async function (
  this: Vue,
  host: string,
  file: File,
) {
  const conn = await this.$getOrFederate(host)
  return (await conn.uploadFile(file)).id
}

Vue.prototype.$fetchUser = async function (
  this: Vue,
  host: string,
  userID: string,
) {
  if (pendingUserFetches[userID]) return
  if (this.$accessor.app.data[host].users[userID]) return
  pendingUserFetches[userID] = true
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getUser(userID)
  const asObj = resp.message?.toObject()
  this.$accessor.app.setUser({
    host,
    userID,
    data: {
      username: asObj?.userName,
      avatar: asObj?.userAvatar,
      status: asObj?.userStatus,
      bot: asObj?.isBot,
    },
  })
  delete pendingUserFetches[userID]
}

Vue.prototype.$fetchMemberList = async function (
  this: Vue,
  host: string,
  guildID: string,
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildMembers(guildID)
  const asObj = resp.message?.toObject()
  this.$accessor.app.setMemberList({
    host,
    guildID,
    memberList: asObj!.membersList,
  })
}

Vue.prototype.$fetchGuildRoles = async function (
  this: Vue,
  host: string,
  guildID: string,
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildRoles(guildID)
  const asObj = resp.message?.toObject()

  const mapped = asObj!.rolesList.reduce<{
    [roleID: string]: IRoleData
  }>((prev, val) => {
    Vue.set(prev, val.roleId, {
      name: val.name,
      color: val.color,
      hoist: val.hoist,
      pingable: val.pingable,
    })
    return prev
  }, {})

  this.$accessor.app.setRolesList({
    host,
    guildID,
    roles: asObj!.rolesList.map((r) => r.roleId),
  })

  this.$accessor.app.setRolesData({
    host,
    roles: mapped,
  })
}

Vue.prototype.$updateProfile = async function (
  this: Vue,
  host: string,
  data: {
    newUsername?: string
    newAvatar?: string
    newStatus?: UserStatusMap[keyof UserStatusMap]
    newIsBot?: boolean
  },
) {
  const conn = await this.$getOrFederate(host)
  return conn.profileUpdate(data)
}

Vue.prototype.$deleteMessage = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  messageID: string,
) {
  const conn = await this.$getOrFederate(host)
  return conn.deleteMessage(guildID, channelID, messageID)
}

Vue.prototype.$editMessage = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  messageID: string,
  newContent?: string,
  newAttachments?: string[],
  newActions?: Action[],
  newEmbeds?: Embed[],
) {
  const conn = await this.$getOrFederate(host)
  return conn.updateMessage(
    guildID,
    channelID,
    messageID,
    newContent,
    newAttachments,
    newActions,
    newEmbeds,
  )
}

Vue.prototype.$deleteChannel = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
) {
  const conn = await this.$getOrFederate(host)
  return conn.deleteChannel(guildID, channelID)
}

Vue.prototype.$sendTyping = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
) {
  const conn = await this.$getOrFederate(host)
  return conn.sendTyping(guildID, channelID)
}

Vue.prototype.$leaveGuild = async function (
  this: Vue,
  host: string,
  guildID: string,
) {
  const conn = await this.$getOrFederate(host)

  return conn.leaveGuild(guildID)
}
