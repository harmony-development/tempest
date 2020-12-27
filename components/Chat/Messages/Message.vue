<template>
  <div
    :class="{ root: true, 'pl-3': true, 'pt-3': !collapseUserInfo, pending }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <v-avatar
      v-if="!collapseUserInfo"
      v-ripple
      class="avatar avatar-space"
      @click="showProfile"
    >
      <v-img :src="avatar" />
    </v-avatar>
    <div v-else class="avatar-space">
      <p v-if="hovering" class="caption text--secondary text">
        {{ smallTimeString }}
      </p>
    </div>
    <div class="content ml-2">
      <v-list-item-title v-if="!collapseUserInfo">
        {{ overrideUsername || username || authorID }}
        <span style="color: var(--v-accent-lighten3)">{{ timeString }} </span>
      </v-list-item-title>
      <p class="text">
        <v-textarea
          v-if="editing"
          ref="editField"
          v-model="editedContent"
          outlined
          auto-grow
          :rows="1"
          hide-details="auto"
          @keydown.esc="editing = false"
          @keypress="onEditKeyPress"
        ></v-textarea>
        <span v-else class="content-out" v-html="formattedContent"></span>
        <v-tooltip v-if="edited && edited !== 0" top>
          <template #activator="{ on, attrs }">
            <span class="edited ml-1" v-bind="attrs" v-on="on">(edited)</span>
          </template>
          <span>{{ editedString }}</span>
        </v-tooltip>
      </p>
      <div
        v-if="attachments && attachments.length > 0"
        class="attachment-container pt-3"
      >
        <attachment v-for="a in attachments || []" :key="a.id" :data="a" />
      </div>
    </div>
    <div class="menu-area">
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon x-small v-bind="attrs" class="menu-btn" v-on="on">
            <v-icon dense> mdi-dots-vertical </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="authorID === $accessor.app.userID"
            link
            @click="editMsg"
          >
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="authorID === $accessor.app.userID"
            link
            @click="deleteMsg"
          >
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="copyID">
            <v-list-item-title>Copy ID</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  display: flex;
}

.root > .menu-area {
  visibility: hidden;
}

.root:hover > .menu-area {
  visibility: visible;
}

.avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  background-color: grey;
  border-radius: 100%;
  cursor: pointer;
}

.avatar-space {
  width: 48px;
  min-width: 48px;
}

.menu-area {
  width: 48px;
  min-width: 48px;
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
  margin-bottom: 0px;
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
  white-space: pre-wrap;
  padding-right: 12px;
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

.content-out >>> .msg-p {
  margin-bottom: 0px;
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
import { DialogType } from '~/store/dialog'

const markdownClasses: {
  [key: string]: string
} = {
  p: 'msg-p',
  pre: 'codeblock',
}

dayjs.extend(calendar)
dayjs.extend(UTC)

const conv = new showdown.Converter({
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
  ghCodeBlocks: true,
  extensions: [
    ...Object.keys(markdownClasses).map((key) => ({
      type: 'output',
      regex: new RegExp(`<${key}>`, 'g'),
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
    collapseUserInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hovering: false,
      editing: false,
      editedContent: '',
    }
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
      return dayjs.unix(this.data?.createdAt || 0).calendar()
    },
    smallTimeString(): string {
      return dayjs.unix(this.data?.createdAt || 0).format('hh:mm')
    },
    edited(): number | undefined {
      return this.data?.editedAt
    },
    editedString(): string {
      return ` - ${dayjs.unix(this.data?.editedAt || 0).calendar()}`
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
    copyID() {
      navigator.clipboard.writeText(this.id)
    },
    async deleteMsg() {
      if (
        await new Promise((resolve) =>
          this.$accessor.dialog.openDialog({
            type: DialogType.Confirmation,
            content: 'Are you sure you want to delete this message?',
            res: resolve,
          }),
        )
      ) {
        try {
          await this.$deleteMessage(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            this.id,
          )
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage)
        }
      }
    },
    async editMsg() {
      this.editing = true
      this.editedContent = this.content
      await this.$nextTick()
      ;(this.$refs.editField as HTMLInputElement).focus()
    },
    async onEditKeyPress(e: KeyboardEvent) {
      if (e.shiftKey) return
      if (e.key === 'Enter') {
        this.editing = false
        return await this.$editMessage(
          this.$getHost(),
          this.$route.params.guildid,
          this.$route.params.channelid,
          this.id,
          this.editedContent,
        )
      }
    },
  },
})
</script>
