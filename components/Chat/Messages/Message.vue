<template>
  <v-list-item>
    <v-list-item-avatar color="grey"></v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        >{{ username || authorID }}
        <span style="color: var(--v-accent-lighten3)">{{
          timeString
        }}</span></v-list-item-title
      >
      <v-list-item-subtitle>{{ content }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import UTC from 'dayjs/plugin/utc'
import { IMessageData } from '~/store/app'

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
    content(): string | undefined {
      return this.data?.content
    },
    timeString(): string {
      return ` - ${dayjs
        .unix(this.data?.createdAt || 0)
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
