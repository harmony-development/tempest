<template>
  <div class="flex-1 flex flex-col h-100">
    <list-item>
      <div class="flex-1">
        <list-item-text>{{ name }}</list-item-text>
      </div>
      <h-btn
        icon
        text
        flat
        aria-label="Guild Settings"
        @pointerdown.native.stop=""
      >
        <h-icon icon="mdiCogOutline" />
      </h-btn>
    </list-item>
    <channel-list />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ChannelList from './ChannelList/ChannelList.vue'
import { IGuildData } from '~/store/app'
export default Vue.extend({
  components: { ChannelList },
  computed: {
    guildData(): IGuildData | undefined {
      return this.$guildData()
    },
    name(): string {
      return this.guildData?.name || this.$route.params.guildid
    },
  },
})
</script>
