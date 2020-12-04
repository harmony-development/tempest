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
          <v-list-item-avatar>
            <v-img
              :src="`${$getHost()}/_harmony/media/download/${avatar}`"
              alt="Avatar"
              class="avatar"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ username || id }}</v-list-item-title>
            <v-list-item-subtitle>Offline</v-list-item-subtitle>
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
import Vue from 'vue'
import { Position } from '~/store/userPopover'

export default Vue.extend({
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
    username() {
      return this.$accessor.app.data[this.$getHost()]?.users[
        this.$accessor.userPopover.id
      ]?.username
    },
    avatar() {
      return this.$accessor.app.data[this.$getHost()]?.users[
        this.$accessor.userPopover.id
      ]?.avatar
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
