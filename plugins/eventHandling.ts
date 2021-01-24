import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'
import { appState } from '~/store/app'

declare module 'vue/types/vue' {
  interface Vue {
    $bindEvents(conn: Connection): void
  }
}

Vue.prototype.$bindEvents = function (this: Vue, conn: Connection) {
  conn.events.on(
    'disconnect',
    (_code, message, _trailers) => {
      appState.setDisconnected(conn.host, message)
    },
    {}
  )

  conn.events.on(
    'event',
    (host, ev) => {
      if (ev.sentMessage) {
        const message = ev.sentMessage.message
        if (message) {
          if (
            ev.sentMessage.echoId &&
            appState.state.data[this.$getHost()]?.messages[
              ev.sentMessage.echoId
            ]
          ) {
            appState.messageUnlocal(
              host,
              message.channelId,
              message.messageId,
              ev.sentMessage.echoId.toString(),
              message.attachmentsList
            )
          } else {
            appState.addMessage(host, message.channelId, message.messageId, {
              authorID: message.authorId,
              createdAt: message.createdAt?.seconds || 0,
              editedAt: message.editedAt?.seconds || 0,
              content: message.content,
              embedsList: message.embedsList,
              actionsList: message.actionsList,
              attachmentsList: message.attachmentsList,
              overrides: message.overrides,
              pending: false,
            })
          }
        }
      } else if (ev.createdChannel) {
        const channelEvent = ev.createdChannel
        if (channelEvent) {
          appState.addChannel(
            host,
            channelEvent.guildId,
            channelEvent.channelId,
            channelEvent.previousId,
            channelEvent.nextId,
            {
              channelName: channelEvent.name,
              isCategory: channelEvent.isCategory,
              isVoice: false,
              messages: undefined,
            }
          )
        }
      } else if (ev.editedMessage) {
        appState.editMessage(host, ev.editedMessage)
      } else if (ev.profileUpdated) {
        const profileEvent = ev.profileUpdated
        appState.updateProfile(
          host,
          profileEvent.userId,
          profileEvent.updateUsername ? profileEvent.newUsername : undefined,
          profileEvent.updateAvatar ? profileEvent.newAvatar : undefined,
          profileEvent.updateStatus ? profileEvent.newStatus : undefined,
          profileEvent.updateIsBot ? profileEvent.isBot : undefined
        )
      } else if (ev.guildAddedToList) {
        const guildAddedEvent = ev.guildAddedToList
        appState.state.guildsList?.push({
          guildId: guildAddedEvent.guildId,
          host: guildAddedEvent.homeserver,
        })
      } else if (ev.guildRemovedFromList) {
        const guildRemovedEvent = ev.guildRemovedFromList
        appState.removeGuildFromList(
          guildRemovedEvent.homeserver,
          guildRemovedEvent.guildId
        )
      } else if (ev.deletedMessage) {
        const deleteMessageEvent = ev.deletedMessage
        appState.deleteMessage(
          host,
          deleteMessageEvent.channelId,
          deleteMessageEvent.messageId
        )
      } else if (ev.deletedChannel) {
        const deleteChannelEvent = ev.deletedChannel
        appState.deleteChannel(
          host,
          deleteChannelEvent.guildId,
          deleteChannelEvent.channelId
        )
      } else if (ev.typing) {
        appState.updateTyping(host, ev.typing.channelId, ev.typing.userId)
      } else if (ev.editedGuild) {
        const editedGuildEvent = ev.editedGuild

        appState.setGuildData(
          host,
          editedGuildEvent.guildId,
          editedGuildEvent.updateName ? editedGuildEvent.name : undefined,
          editedGuildEvent.updatePicture ? editedGuildEvent.picture : undefined
        )
      } else {
        console.log(`unknown event received: ${JSON.stringify(ev)}`)
      }
    },
    {}
  )
}
