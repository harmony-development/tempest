<template>
  <div class="chat">
    <messages />
    <message-input />
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  flex-flow: column;
  width: 100%;
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
