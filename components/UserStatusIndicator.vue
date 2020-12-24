<template>
  <v-badge
    bottom
    overlap
    dot
    bordered
    :offset-x="offsetX"
    :offset-y="offsetY"
    :color="status"
  >
    <slot></slot>
  </v-badge>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserStatus } from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
    offsetX: {
      type: [String, Number],
      default: '18',
    },
    offsetY: {
      type: [String, Number],
      default: '8',
    },
  },
  computed: {
    status(): string {
      switch (
        this.$accessor.app.data[this.$getHost()]?.users[this.id]?.status
      ) {
        case UserStatus.USER_STATUS_OFFLINE: {
          return 'grey'
        }
        case UserStatus.USER_STATUS_IDLE: {
          return 'yellow'
        }
        case UserStatus.USER_STATUS_DO_NOT_DISTURB: {
          return 'red'
        }
        case UserStatus.USER_STATUS_STREAMING: {
          return 'purple'
        }
        case UserStatus.USER_STATUS_ONLINE_UNSPECIFIED: {
          return 'green'
        }
      }
      return 'grey'
    },
  },
})
</script>
