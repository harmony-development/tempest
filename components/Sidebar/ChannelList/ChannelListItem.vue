<template>
  <v-list-item
    :class="{ 'channel-item': true, active: selected }"
    color="primary"
    @click="onClick"
    @mouseover="hovering = true"
    @mouseout="hovering = false"
  >
    <v-list-item-icon style="align-self: center">
      <v-icon size="24px">mdi-pound</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="name"></v-list-item-title>
    </v-list-item-content>
    <v-list-item-action :class="{ 'icon-hidden': !hovering }">
      <v-btn
        icon
        small
        @click.stop="onDeleteClick"
        @mousedown.stop
        @touchstart.native.stop
      >
        <v-icon color="secondary" small>mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<style scoped>
.active {
  border-left: 4px solid var(--v-primary-base);
}

.active::before {
  opacity: 0.24 !important;
}

.icon-hidden {
  visibility: hidden;
}

.channel-item {
  transition: 0.1s ease-in;
}

.channel-item:hover::before {
  opacity: 0.1;
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
  data() {
    return {
      hovering: false,
    }
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
    async onDeleteClick() {
      await this.$confirmDialog(
        'Are you sure you would like to delete this channel?',
        'Delete',
      )
      return this.$deleteChannel(
        this.$getHost(),
        this.$route.params.guildid,
        this.id,
      )
    },
  },
})
</script>
