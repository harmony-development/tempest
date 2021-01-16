<template>
  <virtual-list
    ref="messagesList"
    class="messages-list"
    :data-key="'id'"
    :data-sources="messagesMock || []"
    :estimate-size="32"
    :data-component="messageComponent"
    :keeps="30"
  />
</template>

<style scoped>
.messages-list {
  height: 400px;
  /* flex: 1 0 0; */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-color: var(--v-layer-base);
  scrollbar-width: thin;
}
</style>

<script lang="ts">
import Vue from 'vue'
import mock from '@/static/MOCK_DATA.json'
import VirtualList from 'vue-virtual-scroll-list'
import Message from '@/components/Chat/Messages/Message.vue'

export default Vue.extend({
  components: {
    VirtualList,
  },
  data() {
    return {
      messageComponent: Message,
      messagesMock: mock,
    }
  },
})
</script>
