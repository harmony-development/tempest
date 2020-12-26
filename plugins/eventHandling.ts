import { Connection } from '@harmony-dev/harmony-web-sdk'
import { Event } from '@harmony-dev/harmony-web-sdk/dist/protocol/chat/v1/streaming_pb'
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
    Event.EventCase.SENT_MESSAGE,
    (host, event) => {
      const message = event?.message
      if (message) {
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
    },
    {},
  )

  conn.events.on(
    Event.EventCase.CREATED_CHANNEL,
    (host, event) => {
      this.$accessor.app.addChannel({
        host,
        guildID: event.guildId,
        channelID: event.channelId,
        previousID: event.previousId,
        nextID: event.nextId,
        data: {
          channelName: event.name,
          isCategory: event.isCategory,
          isVoice: false,
          messages: undefined,
        },
      })
    },
    {},
  )

  conn.events.on(
    Event.EventCase.EDITED_MESSAGE,
    (host, event) => {
      this.$accessor.app.editMessage({
        host,
        updateEvent: event,
      })
    },
    {},
  )

  conn.events.on(
    Event.EventCase.PROFILE_UPDATED,
    (host, event) => {
      this.$accessor.app.updateProfile({
        host,
        userid: event.userId,
        username: event.updateUsername ? event.newUsername : undefined,
        avatar: event.updateAvatar ? event.newAvatar : undefined,
        status: event.updateStatus ? event.newStatus : undefined,
      })
    },
    {},
  )

  conn.events.on(
    Event.EventCase.EDITED_GUILD,
    (host, event) => {
      if (event.updateName) this.$accessor.app.setGuildData({
        host,
        guildID: event.guildId,
        name: event.name,
      })
      if (event.updatePicture) this.$accessor.app.setGuildData({
        host,
        guildID: event.guildId,
        picture: event.picture
      })
    },
    {}
  )

  conn.events.on(
    Event.EventCase.GUILD_ADDED_TO_LIST,
    (_, event) => {
      this.$accessor.app.addGuildToList({
        guildId: event.guildId,
        host: event.homeserver,
      })
    },
    {},
  )
}
