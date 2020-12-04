<template>
  <div class="root pa-3">
    <v-avatar v-ripple class="avatar" @click="showProfile">
      <v-img :src="`${$getHost()}/_harmony/media/download/${avatar}`" />
    </v-avatar>
    <div class="message-body ml-2">
      <v-list-item-title
        >{{ username || authorID }}
        <span style="color: var(--v-accent-lighten3)">{{
          timeString
        }}</span></v-list-item-title
      >
      {{ content }}
      <div class="attachment-container">
        <img
          v-for="a in attachments || []"
          :key="a"
          :src="`${$getHost()}/_harmony/media/download/${a}`"
          class="attachment-img"
          @click="openImagePreview(a)"
        />
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

.attachment-img {
  width: 40%;
  cursor: pointer;
}

.content {
  text-overflow: unset;
  white-space: pre-line;
}

@media only screen and (max-width: 1200px) {
  .attachment-img {
    width: 66.66%;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'
import { IMessageData } from '~/store/app'
import { AnimationDirection, Position } from '~/store/userPopover'

dayjs.extend(calendar)
dayjs.extend(UTC)

export default Vue.extend({
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
    attachments(): string[] | undefined {
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
    openImagePreview(id: string) {
      this.$accessor.imageView.openDialog(id)
    },
  },
})
</script>
