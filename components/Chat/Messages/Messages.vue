<template>
  <dynamic-scroller
    ref="scroller"
    :items="mappedMessages || []"
    :min-item-size="8"
    :buffer="50"
    :detect-hover="false"
    class="flex-1 overflow-auto flex flex-col"
    @scroll.native="debouncedScroll"
  >
    <template v-slot="{ item, index, active }">
      <dynamic-scroller-item
        :item="item"
        :active="active"
        :size-dependencies="[item.content]"
        :data-index="index"
      >
        <message :source="item" />
      </dynamic-scroller-item>
    </template>
  </dynamic-scroller>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  DynamicScroller,
  DynamicScrollerItem,
} from '@akryuminfinitum/vue-virtual-scroller'
import debounce from 'lodash.debounce'
import { DebouncedFunc } from 'lodash'
import Message from './Message.vue'
import { IMessageData } from '~/store/app'
import '@akryuminfinitum/vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default Vue.extend({
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    Message,
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
    debouncedScroll(): DebouncedFunc<() => Promise<void>> {
      return debounce(this.onScroll, 100, { maxWait: 0, leading: true })
    },
  },
  watch: {
    messagesList: {
      async handler() {
        const el = (this.$refs.scroller as any).$el as HTMLDivElement
        const distanceFromBottom =
          el.scrollHeight - (el.scrollTop + el.clientHeight)
        await this.$nextTick()
        if (distanceFromBottom < 200) {
          ;(this.$refs.scroller as any).scrollToBottom()
        }
      },
    },
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async onScroll(e: WheelEvent) {
      const el = e.target as HTMLDivElement
      if (el.scrollTop === 0) {
        const oldScrollTop = el.scrollTop
        const oldScroll = el.scrollHeight - el.clientHeight
        await this.fetchData(this.messagesList?.[0])
        await this.$nextTick()
        const newScroll = el.scrollHeight - el.clientHeight
        el.scrollTop = oldScrollTop + (newScroll - oldScroll)
      }
    },
    async fetchData(lastMessageID?: string): Promise<string[] | undefined> {
      if (
        this.$route.params.guildid &&
        this.$route.params.channelid &&
        (lastMessageID ||
          !this.$accessor.app.data[this.$getHost()]?.channels[
            this.$route.params.channelid
          ]?.messages)
      ) {
        try {
          return await this.$fetchMessageList(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            lastMessageID
          )
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
