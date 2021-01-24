<template>
  <list-item @click.native="onClick">
    <h-icon icon="mdiPound" class="text-gray-400 mr-1" size="22" />
    <list-item-text>{{ name }}</list-item-text>
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { appState, IChannelData } from '~/store/app'
export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    data(): IChannelData | undefined {
      return appState.getChannel(this.$getHost(), this.id)
    },
    name(): string | undefined {
      return this.data?.channelName
    },
    selected(): boolean {
      return this.$route.params.channelid === this.id
    },
    unread(): boolean | undefined {
      return this.data?.unread
    },
  },
  methods: {
    onClick() {
      this.$updateRoute({
        channelid: this.id,
      })
      appState.markAsRead(this.$getHost(), this.id)
    },
  },
})
</script>
