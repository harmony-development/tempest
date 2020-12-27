import { Connection } from '@harmony-dev/harmony-web-sdk'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $bindEvents(conn: Connection): void
  }
}

Vue.prototype.$bindEvents = function (this: Vue, conn: Connection) {
  conn.events.on(
    'disconnect',
    (_code, message, _trailers) => {
      this.$accessor.app.setDisconnected({
        host: conn.host,
        message,
      })
    },
    {},
  )

  conn.events.on(
    'event',
    (host, ev) => {
      if (ev.sentMessage) {
        const message = ev.sentMessage.message
        if (message) {
          if (ev.sentMessage.echoId) {
            this.$accessor.app.messageUnlocal({
              host,
              channelID: message.channelId,
              messageID: message.messageId,
              echoID: ev.sentMessage.echoId.toString(),
              attachments: message.attachmentsList,
            })
          } else {
            this.$accessor.app.addMessage({
              host,
              channelID: message.channelId,
              messageID: message.messageId,
              data: {
                authorID: message.authorId,
                createdAt: message.createdAt?.seconds || 0,
                editedAt: message.editedAt?.seconds || 0,
                content: message.content,
                embedsList: message.embedsList,
                actionsList: message.actionsList,
                attachmentsList: message.attachmentsList,
                overrides: message.overrides,
                pending: false,
              },
            })
          }
        }
      } else if (ev.createdChannel) {
        const channelEvent = ev.createdChannel
        if (channelEvent) {
          this.$accessor.app.addChannel({
            host,
            guildID: channelEvent.guildId,
            channelID: channelEvent.channelId,
            previousID: channelEvent.previousId,
            nextID: channelEvent.nextId,
            data: {
              channelName: channelEvent.name,
              isCategory: channelEvent.isCategory,
              isVoice: false,
              messages: undefined,
            },
          })
        }
      } else if (ev.editedMessage) {
        this.$accessor.app.editMessage({
          host,
          updateEvent: ev.editedMessage,
        })
      } else if (ev.profileUpdated) {
        const profileEvent = ev.profileUpdated
        this.$accessor.app.updateProfile({
          host,
          userid: profileEvent.userId,
          username: profileEvent.updateUsername
            ? profileEvent.newUsername
            : undefined,
          avatar: profileEvent.updateAvatar
            ? profileEvent.newAvatar
            : undefined,
          status: profileEvent.updateStatus
            ? profileEvent.newStatus
            : undefined,
        })
      } else if (ev.guildAddedToList) {
        const guildAddedEvent = ev.guildAddedToList
        this.$accessor.app.addGuildToList({
          guildId: guildAddedEvent.guildId,
          host: guildAddedEvent.homeserver,
        })
      } else if (ev.deletedMessage) {
        const deleteMessageEvent = ev.deletedMessage
        this.$accessor.app.deleteMessage({
          host,
          channelID: deleteMessageEvent.channelId,
          messageID: deleteMessageEvent.messageId,
        })
      } else if (ev.deletedChannel) {
        const deleteChannelEvent = ev.deletedChannel
        this.$accessor.app.deleteChannel({
          host,
          guildID: deleteChannelEvent.guildId,
          channelID: deleteChannelEvent.channelId,
        })
      } else {
        console.log(`unknown event received: ${JSON.stringify(ev)}`)
      }
    },
    {},
  )
}
