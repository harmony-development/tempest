<template>
  <div class="chat">
    <div ref="messagesList" class="messages-list" @scroll="debouncedScroll">
      <h3 v-if="reachedTop" class="ma-3 font-weight-regular">
        Welcome to the start of <strong>#{{ channelName }}</strong>
      </h3>
      <div v-else class="ma-3 d-flex justify-center align-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <lazy-loader
        v-for="(item, idx) in mappedMessages || []"
        :id="item.id"
        :key="item.id"
      >
        <message
          :content="item.content"
          :attachments="item.attachmentsList"
          :author-i-d="item.authorID"
          :created-at="item.createdAt"
          :edited-at="item.editedAt"
          :override-username="item.overrides ? item.overrides.name : undefined"
          :override-avatar="item.overrides ? item.overrides.avatar : undefined"
          :overrides="item.overrides"
          :pending="item.pending"
          :collapse-user-info="getShouldCollapse(item.id, idx)"
        />
      </lazy-loader>
    </div>
  </div>
</template>

<style scoped>
.messages-list {
  height: 100%;
  flex: 1 0 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-color: var(--harmony-borders) transparent;
  scrollbar-width: thin;
}
.messages-list > *:last-child {
  padding-bottom: 1rem;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--v-chromeOuter-darken2);
  border-radius: 32px;
}

::-webkit-scrollbar-thumb {
  background: var(--v-chromeOuter-base);
  border-radius: 32px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Intersect } from 'vuetify/lib/directives'
import { debounce } from 'debounce'
import Message from './Message.vue'
import { DialogType } from '~/store/dialog'
import { IMessageData } from '~/store/app'

Vue.directive('intersect', Intersect)

Vue.component('lazy-loader', {
  data() {
    return {
      visible: false,
      previousHeight: '',
    }
  },
  methods: {
    onObserve(
      _entries: IntersectionObserverEntry[],
      _observer: IntersectionObserver,
      _isIntersecting: boolean,
    ) {
      if (this.visible) return

      const elm = _entries[0].target as HTMLElement

      if (this.visible && !_isIntersecting) {
        Vue.set(this, 'previousHeight', elm.offsetHeight.toString())
      } else if (!this.visible && _isIntersecting) {
        Vue.set(this, 'previousHeight', '')
      }

      Vue.set(this, 'visible', _isIntersecting)
    },
    obtainContent() {
      return this.visible ? this.$slots.default : undefined
    },
  },
  render(ce): Vue.VNode {
    return ce(
      'div',
      {
        style: {
          'min-height': this.previousHeight,
        },
        directives: [
          {
            name: 'intersect',
            value: {
              handler: this.onObserve,
              options: {
                rootMargin: '100px',
              },
            },
          },
        ],
      },
      [this.obtainContent()],
    )
  },
})

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
      return this.$accessor.app.data[this.$getHost()]?.messages
    },
    mappedMessages(): (IMessageData & { id: string })[] | undefined {
      return this.messagesList?.map((m) => ({
        ...this.messages[m],
        id: m,
      }))
    },
    reachedTop() {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.reachedTop
    },
    channelName() {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.channelName
    },
    debouncedScroll(): (() => Promise<void>) & { clear(): void } & {
      flush(): void
    } {
      return debounce(this.onMessagesListScroll, 100)
    },
  },
  watch: {
    '$route.params.channelid': {
      handler() {
        this.fetchData()
      },
    },
    messagesList: {
      async handler() {
        const el = this.$refs.messagesList as HTMLDivElement
        const distanceFromBottom =
          el.scrollHeight - (el.scrollTop + el.clientHeight)
        await this.$nextTick()
        if (distanceFromBottom < 200) {
          el.scrollTop = el.scrollHeight - el.clientHeight
        }
      },
    },
  },
  async mounted() {
    const el = this.$refs.messagesList as HTMLDivElement
    await this.fetchData()
    el.scrollTop = el.scrollHeight
  },
  methods: {
    async fetchData(lastMessageID?: string) {
      const firstFetch = !this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.messages
      const el = this.$refs.messagesList as HTMLDivElement
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
            lastMessageID,
          )
          if (firstFetch) {
            el.scrollTop = el.scrollHeight
          }
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage || e)
        }
      }
    },
    async onMessagesListScroll() {
      const el = this.$refs.messagesList as HTMLDivElement
      const oldScrollTop = el.scrollTop
      const oldScroll = el.scrollHeight - el.clientHeight
      if (el.scrollTop === 0) {
        console.log(this.messagesList?.[0])
        await this.fetchData(this.messagesList?.[0])
        const newScroll = el.scrollHeight - el.clientHeight
        el.scrollTop = oldScrollTop + (newScroll - oldScroll)
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
