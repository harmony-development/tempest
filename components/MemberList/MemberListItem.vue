<template>
  <user-popover :id="id" v-model="popoverOpen">
    <template v-slot:activator="{ on, attrs }">
      <div
        :class="{ active: popoverOpen, 'member-item': true, 'pa-1': true }"
        v-bind="attrs"
        v-on="on"
      >
        <v-img class="avatar mr-2"></v-img>
        <v-list-item-title>{{ name || id }}</v-list-item-title>
      </div>
    </template>
  </user-popover>
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
  background-color: var(--v-accent-base);
}

.member-item:active {
  background-color: var(--v-accent-lighten1);
}

.active {
  background-color: var(--v-accent-lighten1);
}

.active:hover {
  background-color: var(--v-accent-lighten1);
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
import UserPopover from '../UserPopover.vue'
export default Vue.extend({
  components: { UserPopover },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popoverOpen: false,
    }
  },
  computed: {
    name(): string | undefined {
      return this.$accessor.app.data[this.$getHost()]?.users[this.id]?.username
    },
  },
})
</script>
