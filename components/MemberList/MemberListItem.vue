<template>
  <div
    v-ripple
    :class="{ active: popoverOpen, 'member-item': true, 'pa-1': true }"
    @click="clicked"
  >
    <user-status-indicator :id="id">
      <v-img class="avatar mr-2" :src="avatar"> </v-img>
    </user-status-indicator>
    <v-list-item-title
      >{{ name || id }} <code v-if="isBot">BOT</code></v-list-item-title
    >
  </div>
</template>

<style scoped>
.member-item {
  transition: 0.1s ease-in;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  user-select: none;
}

.member-item:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.member-item:active {
  background-color: rgba(0, 0, 0, 0.08);
}

.avatar {
  background-color: grey;
  width: 36px;
  height: 36px;
  border-radius: 48px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import UserStatusIndicator from '../UserStatusIndicator.vue'
import { IUserData } from '~/store/app'
import { AnimationDirection, Position } from '~/store/userPopover'
export default Vue.extend({
  components: {
    UserStatusIndicator,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    profile(): IUserData | undefined {
      return this.$accessor.app.data[this.$getHost()]?.users[this.id]
    },
    name(): string | undefined {
      return this.profile?.username
    },
    isBot(): boolean {
      return this.profile?.bot || false
    },
    popoverOpen(): boolean {
      return this.$accessor.userPopover.open
    },
    avatar(): string | undefined {
      if (!this.id) return undefined
      const a = this.profile?.avatar
      return a ? `${this.$getHost()}/_harmony/media/download/${a}` : undefined
    },
  },
  mounted() {
    if (this.id) {
      this.$fetchUser(this.$getHost(), this.id)
    }
  },
  methods: {
    clicked(ev: MouseEvent) {
      const el = ev.currentTarget as HTMLDivElement
      this.$accessor.userPopover.openDialog({
        id: this.id,
        element: el,
        animationDirection: AnimationDirection.xReverse,
        position: Position.LEFT,
      })
    },
  },
})
</script>
