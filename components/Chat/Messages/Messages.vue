<template>
  <virtual-list
    ref="messagesList"
    class="flex-1 overflow-auto flex flex-col"
    :data-key="'id'"
    :data-sources="mappedMessages || []"
    :estimate-size="40"
    :keeps="36"
    :data-component="messageComponent"
  >
  </virtual-list>
</template>

<script lang="ts">
import Vue from 'vue'
import VirtualList from 'vue-virtual-scroll-list'
import Message from './Message.vue'
import { IMessageData } from '~/store/app'

export default Vue.extend({
  components: {
    VirtualList,
  },
  data() {
    return {
      messageComponent: Message,
    }
  },
  computed: {
    messages(): {
      [id: string]: IMessageData
    } {
      return this.$messages()
    },
    messagesList(): string[] | undefined {
      return this.$channelData()?.messages
    },
    mappedMessages():
      | (IMessageData & { id: string; shouldCollapse: boolean })[]
      | undefined {
      return this.messagesList?.map((m, idx) => ({
        ...this.messages[m],
        id: m,
        shouldCollapse: this.getShouldCollapse(m, idx),
      }))
    },
  },
  async mounted() {
    this.$confirmDialog('Are you sure?', 'Yes')
    await this.fetchData()
    await this.fetchData(this.messagesList?.[0])
    await this.fetchData(this.messagesList?.[0])
    await this.fetchData(this.messagesList?.[0])
  },
  methods: {
    async fetchData(lastMessageID?: string) {
      const firstFetch = !this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.messages
      // const el = this.$refs.messagesList as HTMLDivElement
      if (
        this.$route.params.guildid &&
        this.$route.params.channelid &&
        (lastMessageID ||
          !this.$accessor.app.data[this.$getHost()]?.channels[
            this.$route.params.channelid
          ]?.messages)
      ) {
        try {
          await this.$fetchMessageList(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            lastMessageID
          )
          if (firstFetch) {
            // el.scrollTop = el.scrollHeight
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    getShouldCollapse(messageID: string, idx: number): boolean {
      if (!this.messagesList) return false

      const messages = this.$accessor.app.data[this.$getHost()].messages

      const previous = messages[this.messagesList[idx - 1]]
      const current = messages[messageID]

      if (previous?.overrides && current?.overrides) {
        return previous.overrides.name === current.overrides.name
      }

      return (
        previous?.authorID === current?.authorID &&
        current?.createdAt - previous?.createdAt < 420000
      )
    },
  },
})
</script>
