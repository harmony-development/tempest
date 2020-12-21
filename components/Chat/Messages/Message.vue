<template>
  <div class="root pa-3">
    <v-avatar v-ripple class="avatar" @click="showProfile">
      <v-img :src="`${$getHost()}/_harmony/media/download/${avatar}`" />
    </v-avatar>
    <div class="content ml-2">
      <v-list-item-title>
        {{ username || authorID }}
        <span style="color: var(--v-accent-lighten3)">{{ timeString }}</span>
      </v-list-item-title>
      <p class="text">
        {{ content }}
      </p>
      <div class="attachment-container pt-3">
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
  text-overflow: unset;
  white-space: pre-line;
  width: 100%;
}

.text {
  line-height: 8px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'
import { Message } from '@harmony-dev/harmony-web-sdk/dist/protocol/core/v1/core_pb'
import Attachment from './Attachment.vue'
import { IMessageData } from '~/store/app'
import { AnimationDirection, Position } from '~/store/userPopover'

dayjs.extend(calendar)
dayjs.extend(UTC)

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
    username(): string | undefined {
      if (!this.authorID) return undefined
      return this.$accessor.app.data[this.$getHost()]?.users[this.authorID]
        ?.username
    },
    avatar(): string | undefined {
      if (!this.authorID) return undefined
      return this.$accessor.app.data[this.$getHost()]?.users[this.authorID]
        ?.avatar
    },
    content(): string | undefined {
      return this.data?.content
    },
    timeString(): string {
      return ` - ${dayjs
        .unix(this.data?.createdAt || 0)
        .utc()
        .calendar()}`
    },
    attachments(): Message.Attachment.AsObject[] | undefined {
      return this.data?.attachmentsList
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
