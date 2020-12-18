<template>
  <div class="chat">
    <div ref="messagesList" class="messages-list" @scroll="debouncedScroll">
      <div>
        <h3 v-if="reachedTop" class="ma-3 font-weight-regular">
          Welcome to the start of <strong>#{{ channelName }}</strong>
        </h3>
        <div v-else class="ma-3 d-flex justify-center align-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <message
          v-for="message in messagesList || []"
          :id="message"
          :key="message"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-list {
  height: 100%;
  flex: 1 0 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--v-accent-darken2);
  border-radius: 32px;
}

::-webkit-scrollbar-thumb {
  background: var(--v-accent-darken1);
  border-radius: 32px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>

<script lang="ts">
import Vue from 'vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { debounce } from 'debounce'
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
      return this.$accessor.app.data[this.$getHost()]?.messages
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
  },
  async mounted() {
    const el = this.$refs.messagesList as HTMLDivElement
    await this.fetchData()
    el.scrollTop = el.scrollHeight
  },
  methods: {
    async fetchData(lastMessageID?: string) {
      if (this.$route.params.guildid && this.$route.params.channelid) {
        try {
          await this.$fetchMessageList(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            lastMessageID,
          )
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
        await this.fetchData(this.messagesList?.[0])
        const newScroll = el.scrollHeight - el.clientHeight
        el.scrollTop = oldScrollTop + (newScroll - oldScroll)
      }
    },
  },
})
</script>
