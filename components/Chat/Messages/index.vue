<template>
  <div class="chat">
    <DynamicScroller
      :items="mappedMessages || []"
      :min-item-size="32"
      class="scroller"
      page-mode
    >
      <template v-slot="{ item, active, index }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.content]"
          :data-index="index"
          :data-active="active"
        >
          <message :id="item.id" :msg-data="item" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped>
.scroller {
  height: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import Message from '@/components/Chat/Messages/Message.vue'
import { DialogType } from '~/store/dialog'
import { IMessageData } from '~/store/app'

export default Vue.extend({
  components: {
    Message,
  },
  computed: {
    selectedGuildID() {
      return this.$route.params.guildid
    },
    messagesList(): string[] | undefined {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.messages
    },
    messages() {
      return this.$accessor.app.data[this.$getHost()].messages
    },
    mappedMessages():
      | ({
          id: string
        } & IMessageData)[]
      | undefined {
      return this.messagesList?.map<
        {
          id: string
        } & IMessageData
      >((id) => ({
        id,
        ...this.messages[id],
      }))
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
  },
})
</script>
