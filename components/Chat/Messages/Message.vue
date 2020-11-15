<template>
  <v-list-item>
    <v-list-item-avatar color="grey"></v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ username || authorID }}</v-list-item-title>
      <v-list-item-subtitle>{{ content }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { IMessageData } from '~/store/app'
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
  },
  mounted() {
    if (this.authorID) {
      this.$fetchUser(this.$getHost(), this.authorID)
    }
  },
})
</script>
