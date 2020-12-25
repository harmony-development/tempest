<template>
  <div :class="{ root: true, 'pa-3': true, pending }">
    <v-avatar v-ripple class="avatar" @click="showProfile">
      <v-img :src="avatar" />
    </v-avatar>
    <div class="content ml-2">
      <v-list-item-title>
        {{ overrideUsername || username || authorID }}
        <span style="color: var(--v-accent-lighten3)">{{ timeString }} </span>
      </v-list-item-title>
      <p class="text">
        <span class="content-out" v-html="formattedContent"></span>
        <v-tooltip v-if="edited && edited !== 0" top>
          <template v-slot:activator="{ on, attrs }">
            <span class="edited ml-1" v-bind="attrs" v-on="on">(edited)</span>
          </template>
          <span>{{ editedString }}</span>
        </v-tooltip>
      </p>
      <div v-if="attachments" class="attachment-container pt-3">
        <attachment v-for="a in attachments || []" :key="a.id" :data="a" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  display: flex;
}

.avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  background-color: grey;
  border-radius: 100%;
  cursor: pointer;
}

.attachment-container {
  width: 100%;
}

.content {
  width: 100%;
}

.text {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  width: 100%;
}

.pending {
  opacity: 0.8;
}

.edited {
  color: var(--v-accent-lighten3);
  font-size: 12px;
}

.content-out >>> .codeblock {
  width: 100%;
  display: block;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
}

.content-out >>> .codeblock > code {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  width: 100%;
  display: block;
  padding: 8px;
  padding-left: 12px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'
import { Attachment as MessageAttachment } from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'
import showdown from 'showdown'
import DOMPurify from 'dompurify'
import Attachment from './Attachment.vue'
import { IMessageData, IUserData } from '~/store/app'
import { AnimationDirection, Position } from '~/store/userPopover'

const markdownClasses: {
  [key: string]: string
} = {
  pre: 'codeblock',
}

dayjs.extend(calendar)
dayjs.extend(UTC)

const conv = new showdown.Converter({
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
  extensions: [
    Object.keys(markdownClasses).map((key) => ({
      type: 'output',
      regex: new RegExp(`<${key}(.*)>`, 'g'),
      replace: `<${key} class="${markdownClasses[key]}" $1>`,
    })),
  ],
})

conv.setFlavor('github')

export default Vue.extend({
  components: { Attachment },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    data(): IMessageData | undefined {
      return this.$accessor.app.data[this.$getHost()]?.messages[this.id]
    },
    authorID(): string | undefined {
      return this.data?.authorID
    },
    authorData(): IUserData | undefined {
      if (!this.authorID) return undefined
      return this.$accessor.app.data[this.$getHost()]?.users[this.authorID]
    },
    overrideUsername(): string | undefined {
      return this.data?.overrides?.name
    },
    username(): string | undefined {
      if (!this.authorID) return undefined
      return this.authorData?.username
    },
    overrideAvatar(): string | undefined {
      return this.data?.overrides?.avatar
    },
    avatar(): string | undefined {
      if (!this.authorID) return undefined
      const a = this.overrideAvatar || this.authorData?.avatar
      return a
        ? `${this.$getHost()}/_harmony/media/download/${encodeURIComponent(a)}`
        : undefined
    },
    content(): string {
      return this.data?.content ?? ''
    },
    formattedContent(): string {
      return DOMPurify.sanitize(conv.makeHtml(this.content))
    },
    timeString(): string {
      return ` - ${dayjs
        .unix(this.data?.createdAt || 0)
        .utc()
        .calendar()}`
    },
    edited(): number | undefined {
      return this.data?.editedAt
    },
    editedString(): string {
      return ` - ${dayjs
        .unix(this.data?.editedAt || 0)
        .utc()
        .calendar()}`
    },
    attachments(): MessageAttachment.AsObject[] | undefined {
      return this.data?.attachmentsList
    },
    pending(): boolean | undefined {
      return this.data?.pending
    },
  },
  mounted() {
    if (this.authorID) {
      this.$fetchUser(this.$getHost(), this.authorID)
    }
  },
  methods: {
    showProfile(ev: MouseEvent) {
      if (this.authorID) {
        this.$accessor.userPopover.openDialog({
          id: this.authorID,
          element: ev.currentTarget as Element,
          position: Position.TOP,
          animationDirection: AnimationDirection.yReverse,
        })
      }
    },
  },
})
</script>
