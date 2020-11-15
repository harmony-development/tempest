import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'
import { IChannelData, IMessageData } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $getHost(): string
    $getOrFederate(host: string): Promise<Connection>
    $fetchChannelList(host: string, guildID: string): void
    $fetchMessageList(host: string, guildID: string, channelID: string): void
    $createChannel(host: string, guildID: string, channelName: string): void
    $sendMessage(
      host: string,
      guildID: string,
      channelID: string,
      content?: string,
    ): void
    $fetchUser(host: string, userID: string): void
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
) {
  const conn = await this.$getOrFederate(host)
  const resp = await conn.getChannelMessages(guildID, channelID)
  const asObj = resp.message?.toObject()

  const mapped = asObj!.messagesList.reduce<{
    [messageID: string]: IMessageData
  }>((prev, val) => {
    Vue.set(prev, val.location!.messageId, {
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

  this.$accessor.app.setChannelMessages({
    host,
    channelID,
    messages: asObj!.messagesList.map((c) => c.location!.messageId),
  })
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
  const resp = await conn.createChannel(guildID, channelName)
  const asObj = resp.message?.toObject()
  this.$accessor.app.addChannel({
    host,
    guildID,
    channelID: asObj!.channelId,
    data: {
      channelName,
      isCategory: false,
      isVoice: false,
      messages: undefined,
    },
  })
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
  const conn = await this.$getOrFederate(host)
  if (pendingUserFetches[userID]) return
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
}
