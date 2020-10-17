<template>
  <div class="guild-list">
    <guild-menu-button />
  </div>
</template>

<style scoped>
.guild-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: var(--harmony-dark-800);
}
</style>

<script lang="ts">
import Vue from 'vue'
import GuildMenuButton from './GuildMenuButton.vue'

export default Vue.extend({
  components: {
    GuildMenuButton,
  },
})
</script>
