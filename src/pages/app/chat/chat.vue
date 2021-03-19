<script lang="ts" setup>
import Messages from "./messages/messages.vue";
import MsgInput from "./msginput/msginput.vue";
</script>
<template>
  <div class="flex-1 p-4 overflow-x-auto">
    <messages />
  </div>
  <msg-input />
</template>
