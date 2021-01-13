<template>
  <div class="chat">
    <v-toolbar dense />
    <messages />
    <message-input />
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex: 1 1 100%;
  min-height: auto;
  min-width: 0;
  flex-direction: column;
  height: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Messages from './Messages/index.vue'
import MessageInput from './MessageInput/index.vue'

export default Vue.extend({
  components: {
    Messages,
    MessageInput,
  },
})
</script>
