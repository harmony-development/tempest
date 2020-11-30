<template>
  <div
    :class="{ active: selected, 'member-item': true, 'pa-1': true }"
    @click="clicked"
  >
    <v-img class="avatar mr-2"></v-img>
    <v-list-item-title>{{ name || id }}</v-list-item-title>
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
export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    name(): string | undefined {
      return this.$accessor.app.data[this.$getHost()]?.users[this.id]?.username
    },
  },
  methods: {
    clicked() {
      this.$emit('memberSelectionChanged', this.id)
    },
  },
})
</script>
