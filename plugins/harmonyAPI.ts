import { Connection } from '@harmony-dev/harmony-web-sdk'
import {
  PermissionList,
  Role,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/chat/v1/permissions_pb'
import {
  Action,
  Embed,
  UserStatusMap,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'
import Vue from 'vue'
import { appState, IChannelData, IMessageData, IRoleData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $getHost(): string
    $getOrFederate(host: string): Promise<Connection>
    $homeserverConn(): Connection
    $addGuildToList(host: string, guildID: string): void
    $fetchChannelList(host: string, guildID: string): void
    $fetchMessageList(
      host: string,
      guildID: string,
      channelID: string,
      lastMessageID?: string
    ): string[]
    $createChannel(host: string, guildID: string, channelName: string): void
    $sendMessage(
      host: string,
      guildID: string,
      channelID: string,
      content?: string,
      attachments?: string[],
      echoID?: number
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
      }
    ): void
    $deleteMessage(
      host: string,
      guildID: string,
      channelID: string,
      messageID: string
    ): void
    $editMessage(
      host: string,
      guildID: string,
      channelID: string,
      messageID: string,
      newContent?: string,
      newAttachments?: string[],
      newActions?: Action[],
      newEmbeds?: Embed[]
    ): void
    $deleteChannel(host: string, guildID: string, channelID: string): void
    $sendTyping(host: string, guildID: string, channelID: string): void
    $leaveGuild(host: string, guildID: string): void
    $fetchInvites(host: string, guildID: string): void
    $deleteInvite(host: string, guildID: string, inviteID: string): void
    $createInvite(
      host: string,
      guildID: string,
      inviteID: string,
      maxUses: number
    ): void
    $updateGuildInfo(
      host: string,
      guildID: string,
      newName?: string,
      newPicture?: string
    ): void
    $fetchPermissions(
      host: string,
      guildID: string,
      channelID: string,
      roleID: string
    ): void
    $setRolePermissions(
      this: Vue,
      host: string,
      guildID: string,
      channelID: string | undefined,
      roleID: string,
      perms: PermissionList
    ): void
    $deleteRole(this: Vue, host: string, guildID: string, roleID: string): void
    $createRole(
      host: string,
      guildID: string,
      name: string,
      color: number,
      hoist: boolean,
      pingable: boolean
    ): void
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

Vue.prototype.$homeserverConn = function (this: Vue) {
  const host = appState.state.host!
  if (appState.state.connections[host]) return appState.state.connections[host]
  const conn = new Connection(host)
  appState.state.connections[host] = conn
  conn.session = appState.state.session
  this.$bindEvents(conn)
  conn.beginStream()
  return conn
}

Vue.prototype.$getOrFederate = function (this: Vue, host: string) {
  if (!host) host = appState.state.host!
  if (appState.state.connections[host]) return appState.state.connections[host]
  if (pendingFederations[host]) return pendingFederations[host]
  const process = async () => {
    const federateResp = await appState.state.connections[
      appState.state.host!
    ].federate(host)
    const conn = new Connection(host)
    const loginResp = await conn.loginFederated(
      federateResp.message!.getToken(),
      appState.state.host!.replace('https://', '')
    )
    conn.session = loginResp.message!.getSessionToken()
    appState.state.connections[host] = conn
    delete pendingFederations[host]
    this.$bindEvents(conn)
    conn.beginStream()
    return appState.state.connections[host]
  }
  pendingFederations[host] = process()
  return pendingFederations[host]
}

Vue.prototype.$addGuildToList = function (
  this: Vue,
  host: string,
  guildID: string
) {
  if (!appState.state.host) return
  return appState.state.connections[appState.state.host].addGuildToGuildList(
    guildID,
    host
  )
}

Vue.prototype.$fetchChannelList = async function (
  this: Vue,
  host: string,
  guildID: string
) {
  if (appState.state.data[host]?.guilds[guildID]?.channels) return
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildChannels(guildID)
  const asObj = resp.message!.toObject()

  const mapped = asObj.channelsList.reduce<{
    [channelID: string]: IChannelData
  }>((prev, val) => {
    Vue.set(prev, val.channelId, {
      channelName: val.channelName,
      isCategory: val.isCategory,
      isVoice: false,
      unread: false,
    })
    return prev
  }, {})

  appState.setGuildChannels(
    host,
    this.$route.params.guildid,
    asObj!.channelsList.map((c) => c.channelId)
  )
  appState.setChannelData(host, mapped)

  if (asObj!.channelsList[0]) {
    this.$updateRoute({
      channelid: asObj!.channelsList[0].channelId,
    })
  }
}

Vue.prototype.$fetchMessageList = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  lastMessageID?: string
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

  const messagesList = asObj!.messagesList.map((m) => m.messageId).reverse()

  if (lastMessageID) {
    appState.prependChannelMessages(host, channelID, messagesList)
    appState.setReachedTop(host, channelID, reachedTop)
  } else {
    appState.setChannelMessages(host, channelID, messagesList)
  }
  appState.setMessagesData(host, mapped)
  return messagesList
}

Vue.prototype.$createChannel = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelName: string
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
  echoID?: number
) {
  const conn = await this.$getOrFederate(host)
  return conn.sendMessage(
    guildID,
    channelID,
    content,
    attachments,
    undefined,
    undefined,
    echoID
  )
}

Vue.prototype.$uploadFile = async function (
  this: Vue,
  host: string,
  file: File
) {
  const conn = await this.$getOrFederate(host)
  return (await conn.uploadFile(file)).id
}

Vue.prototype.$fetchUser = async function (
  this: Vue,
  host: string,
  userID: string
) {
  if (pendingUserFetches[userID]) return
  if (appState.state.data[host]?.users[userID]) return
  pendingUserFetches[userID] = true
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getUser(userID)
  const asObj = resp.message?.toObject()
  appState.setUser(host, userID, {
    username: asObj?.userName,
    avatar: asObj?.userAvatar,
    status: asObj?.userStatus,
    bot: asObj?.isBot,
  })
  delete pendingUserFetches[userID]
}

Vue.prototype.$fetchMemberList = async function (
  this: Vue,
  host: string,
  guildID: string
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildMembers(guildID)
  const asObj = resp.message?.toObject()
  appState.setMemberList(host, guildID, asObj!.membersList)
}

Vue.prototype.$fetchGuildRoles = async function (
  this: Vue,
  host: string,
  guildID: string
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getGuildRoles(guildID)
  const asObj = resp.message!.toObject()

  const mapped = asObj.rolesList.reduce<{
    [roleID: string]: IRoleData
  }>((obj, val) => {
    Vue.set(obj, val.roleId, {
      name: val.name,
      color: val.color,
      hoist: val.hoist,
      pingable: val.pingable,
    })
    return obj
  }, {})

  appState.setRolesData(host, mapped)

  appState.setRolesList(
    host,
    guildID,
    asObj!.rolesList.map((r) => r.roleId)
  )
}

Vue.prototype.$updateProfile = async function (
  this: Vue,
  host: string,
  data: {
    newUsername?: string
    newAvatar?: string
    newStatus?: UserStatusMap[keyof UserStatusMap]
    newIsBot?: boolean
  }
) {
  const conn = await this.$getOrFederate(host)
  return conn.profileUpdate(data)
}

Vue.prototype.$deleteMessage = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  messageID: string
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
  newEmbeds?: Embed[]
) {
  const conn = await this.$getOrFederate(host)
  return conn.updateMessage(
    guildID,
    channelID,
    messageID,
    newContent,
    newAttachments,
    newActions,
    newEmbeds
  )
}

Vue.prototype.$deleteChannel = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string
) {
  const conn = await this.$getOrFederate(host)
  return conn.deleteChannel(guildID, channelID)
}

Vue.prototype.$sendTyping = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string
) {
  const conn = await this.$getOrFederate(host)
  return conn.sendTyping(guildID, channelID)
}

Vue.prototype.$leaveGuild = async function (
  this: Vue,
  host: string,
  guildID: string
) {
  const conn = await this.$getOrFederate(host)

  return conn.leaveGuild(guildID)
}

Vue.prototype.$fetchInvites = async function (
  this: Vue,
  host: string,
  guildID: string
) {
  const conn = await this.$getOrFederate(host)
  const invites = await conn.getGuildInvites(guildID)
  const asObj = invites.message!.toObject()
  appState.setInvites(host, guildID, asObj.invitesList)
}

Vue.prototype.$deleteInvite = async function (
  this: Vue,
  host: string,
  guildID: string,
  inviteID: string
) {
  const conn = await this.$getOrFederate(host)
  return conn.deleteInvite(guildID, inviteID)
}

Vue.prototype.$createInvite = async function (
  this: Vue,
  host: string,
  guildID: string,
  inviteID: string,
  maxUses: number
) {
  const conn = await this.$getOrFederate(host)
  return conn.createInvite(guildID, inviteID, maxUses)
}

Vue.prototype.$updateGuildInfo = async function (
  this: Vue,
  host: string,
  guildID: string,
  newName?: string,
  newPicture?: string
) {
  const conn = await this.$getOrFederate(host)
  return conn.updateGuildInfo(guildID, newName, newPicture)
}

Vue.prototype.$fetchPermissions = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string,
  roleID: string
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getPermissions(guildID, channelID, roleID)
  const asObj = resp.message!.toObject()
  const permsList = asObj.perms!.permissionsList

  appState.setPermissions(
    host,
    roleID,
    permsList!.reduce((obj, perm) => {
      Vue.set(obj, perm.matches, perm.mode)
      return obj
    }, {})
  )
}

Vue.prototype.$setRolePermissions = async function (
  this: Vue,
  host: string,
  guildID: string,
  channelID: string | undefined,
  roleID: string,
  perms: PermissionList
) {
  const conn = await this.$getOrFederate(host)
  conn.setRolePermissions(guildID, channelID, roleID, perms)
}

Vue.prototype.$deleteRole = async function (
  this: Vue,
  host: string,
  guildID: string,
  roleID: string
) {
  const conn = await this.$getOrFederate(host)
  return conn.deleteGuildRole(guildID, roleID)
}

Vue.prototype.$createRole = async function (
  this: Vue,
  host: string,
  guildID: string,
  name: string,
  color: number,
  hoist: boolean,
  pingable: boolean
) {
  const conn = await this.$getOrFederate(host)
  const role = new Role()
  role.setName(name)
  role.setColor(color)
  role.setHoist(hoist)
  role.setPingable(pingable)
  return conn.createRole(guildID, role)
}

Vue.prototype.$getPermissions = async function (
  this: Vue,
  host: string,
  guildID: string,
  userID: string
) {
  const conn = await this.$getOrFederate(host)
  await conn.getUserRoles(guildID, userID)
}
