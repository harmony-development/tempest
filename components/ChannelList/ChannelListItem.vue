<template>
  <v-list-item
    :class="{ 'channel-item': true, active: selected }"
    color="primary"
    @click="onClick"
  >
    <v-list-item-icon>
      <v-icon size="24px">mdi-pound</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="name"></v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<style scoped>
.active {
  background-color: var(--v-accent-base);
  border-left: 4px solid var(--v-primary-base);
}

.channel-item {
  transition: 0.1s ease-in;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    name(): string | undefined {
      return this.$accessor.app.data[this.$getHost()]?.channels[this.id]
        ?.channelName
    },
    selected(): boolean {
      return this.$route.params.channelid === this.id
    },
  },
  methods: {
    onClick() {
      this.$updateRoute({
        channelid: this.id,
      })
    },
  },
})
</script>
