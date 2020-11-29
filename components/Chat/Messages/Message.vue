<template>
  <div class="root pa-3">
    <img class="avatar" />
    <div class="message-body ml-2">
      <v-list-item-title
        >{{ username || authorID }}
        <span style="color: var(--v-accent-lighten3)">{{
          timeString
        }}</span></v-list-item-title
      >
      {{ content }}
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
}

.message-body {
}

.content {
  text-overflow: unset;
  white-space: pre-line;
}
</style>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'

dayjs.extend(calendar)
dayjs.extend(UTC)

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
    msgData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    authorID(): string | undefined {
      return this.msgData?.authorID
    },
    username(): string | undefined {
      if (!this.authorID) return undefined
      return this.$accessor.app.data[this.$getHost()]?.users[this.authorID]
        ?.username
    },
    content(): string | undefined {
      return this.msgData?.content
    },
    timeString(): string {
      return ` - ${dayjs
        .unix(this.msgData?.createdAt || 0)
        .utc()
        .calendar()}`
    },
  },
  mounted() {
    if (this.authorID) {
      this.$fetchUser(this.$getHost(), this.authorID)
    }
  },
})
</script>
