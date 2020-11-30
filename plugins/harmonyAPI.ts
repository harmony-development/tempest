import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'
import { IChannelData, IMessageData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $getHost(): string
    $getOrFederate(host: string): Promise<Connection>
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
    ): void
    $fetchUser(host: string, userID: string): void
    $fetchMemberList(host: string, guildID: string): void
  }
}

const pendingFederations: {
  [host: string]: Promise<Connection>
} = {}

const pendingUserFetches: {
  [userID: string]: boolean
} = {}

Vue.prototype.$getHost = function (this: Vue) {
  return this.$route.hash.substr(1).replace('///', '//')
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
      appState.host!,
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
      isVoice: val.isVoice,
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
      createdAt: val.createdAt?.seconds || '0',
      editedAt: val.editedAt?.seconds || '0',
      content: val.content,
      embedsList: val.embedsList,
      actionsList: val.actionsList,
      attachmentsList: val.attachmentsList,
    })
    return prev
  }, {})
  const reachedTop = asObj!.reachedTop

  if (lastMessageID) {
    this.$accessor.app.prependChannelMessages({
      host,
      channelID,
      messages: asObj!.messagesList.map((c) => c.messageId),
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
      messages: asObj!.messagesList.map((c) => c.messageId),
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
) {
  const conn = await this.$getOrFederate(host)
  return conn.sendMessage(guildID, channelID, content)
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
