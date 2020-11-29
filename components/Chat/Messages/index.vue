<template>
  <div class="chat">
    <infinite-loading @infinite="infiniteScrollHandler"></infinite-loading>
    <DynamicScroller
      :items="messagesList || []"
      :min-item-size="64"
      class="scroller"
    >
      <template v-slot="{ item, active, index }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[messages[item].content]"
          :data-index="index"
          :data-active="active"
        >
          <message :id="item" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped>
.scroller {
  height: 100%;
  flex: 1 0 0;
  overflow-y: auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import Message from './Message.vue'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  components: {
    Message,
  },
  computed: {
    selectedGuildID() {
      return this.$route.params.guildid
    },
    messagesList() {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.messages
    },
    messages() {
      return this.$accessor.app.data[this.$getHost()].messages
    },
  },
  watch: {
    '$route.params.channelid': {
      handler() {
        this.fetchData()
      },
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (
        this.$route.params.guildid &&
        this.$route.params.channelid &&
        !this.messagesList
      ) {
        try {
          await this.$fetchMessageList(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
          )
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage || e)
        }
      }
    },
    infiniteScrollHandler() {
      console.log('oh hi')
    },
  },
})
</script>
