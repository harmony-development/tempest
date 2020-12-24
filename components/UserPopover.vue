<template>
  <v-menu
    :value="open"
    :close-on-content-click="false"
    v-bind="$attrs"
    absolute
    :position-x="x"
    :position-y="y"
    :left="position === PositionEnum.LEFT"
    :right="position === PositionEnum.RIGHT"
    :bottom="position === PositionEnum.BOTTOM"
    :top="position === PositionEnum.TOP"
    origin="bottom right"
    :transition="transition"
    @input="closeDialog"
    v-on="$listeners"
  >
    <v-card>
      <v-list>
        <v-list-item>
          <user-status-indicator :id="id" :offset-x="26" :offset-y="16">
            <v-list-item-avatar>
              <v-img
                :src="
                  avatar
                    ? `${$getHost()}/_harmony/media/download/${avatar}`
                    : undefined
                "
                alt="Avatar"
                class="avatar"
              />
            </v-list-item-avatar>
          </user-status-indicator>
          <v-list-item-content>
            <v-list-item-title>{{ username || id }}</v-list-item-title>
            <v-list-item-subtitle>{{ statusString }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
.avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  background-color: grey;
  border-radius: 100%;
}
</style>

<script lang="ts">
import {
  UserStatus,
  UserStatusMap,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'
import Vue from 'vue'
import UserStatusIndicator from './UserStatusIndicator.vue'
import { IUserData } from '~/store/app'
import { Position } from '~/store/userPopover'

export default Vue.extend({
  components: { UserStatusIndicator },
  computed: {
    x(): number {
      return this.$accessor.userPopover.x
    },
    y(): number {
      return this.$accessor.userPopover.y
    },
    id() {
      return this.$accessor.userPopover.id
    },
    open(): boolean {
      return this.$accessor.userPopover.open
    },
    transition(): string {
      return this.$accessor.userPopover.animationDirection
    },
    position(): Position {
      return this.$accessor.userPopover.position
    },
    profile(): IUserData | undefined {
      return this.$accessor.app.data[this.$getHost()]?.users[
        this.$accessor.userPopover.id
      ]
    },
    username(): string | undefined {
      return this.profile?.username
    },
    avatar(): string | undefined {
      return this.profile?.avatar
    },
    status(): UserStatusMap[keyof UserStatusMap] | undefined {
      return this.profile?.status
    },
    statusString(): string {
      switch (this.status) {
        case UserStatus.USER_STATUS_OFFLINE: {
          return 'Offline'
        }
        case UserStatus.USER_STATUS_IDLE: {
          return 'Idle'
        }
        case UserStatus.USER_STATUS_DO_NOT_DISTURB: {
          return 'Do Not Disturb'
        }
        case UserStatus.USER_STATUS_ONLINE_UNSPECIFIED: {
          return 'Online'
        }
        case UserStatus.USER_STATUS_STREAMING: {
          return 'Streaming'
        }
      }
      return 'Offline'
    },
    PositionEnum(): typeof Position {
      return Position
    },
  },
  methods: {
    closeDialog() {
      this.$accessor.userPopover.closeDialog()
    },
  },
})
</script>
