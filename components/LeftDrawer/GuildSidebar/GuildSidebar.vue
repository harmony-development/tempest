<template>
  <list-item>
    <div class="flex-1">
      <h1 class="text-sm">{{ name }}</h1>
    </div>
    <h-btn
      icon
      text
      flat
      aria-label="Guild Settings"
      class="hint--bottom-left"
      @pointerdown.native.stop=""
    >
      <h-icon icon="mdiCogOutline" />
    </h-btn>
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { IGuildData } from '~/store/app'
export default Vue.extend({
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
