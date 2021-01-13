<template>
  <div class="pl-3 pr-3 pb-3 pt-3 root message-field harmony darken-1">
    <div v-if="!!typingDisplay" class="typing-indicator">
      <v-icon :class="{ invisible: !typingDisplay }">
        mdi-dots-horizontal
      </v-icon>
      {{ typingDisplay || '&nbsp;' }}
      &zwnj;
    </div>
    <v-slide-group
      v-if="attachments.length > 0"
      multiple
      show-arrows
      class="mb-2"
    >
      <v-slide-item v-for="(a, idx) in attachments" :key="idx">
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-img
              v-if="a.file.type.startsWith('image/')"
              :src="a.preview"
              class="grey lighten-2 thumbnail"
              max-height="100"
              max-width="177"
            >
              <v-fade-transition>
                <v-overlay v-if="hover || uploading" absolute color="black">
                  <v-btn
                    v-if="!uploading"
                    icon
                    class="delete-btn"
                    @click="deleteSelectedFile(idx)"
                  >
                    <v-icon> mdi-close </v-icon>
                  </v-btn>
                  <v-progress-linear value="15"></v-progress-linear>
                </v-overlay>
              </v-fade-transition>
            </v-img>
            <v-card v-else outlined :loading="uploading">
              <v-card-title>{{ a.file.name }}</v-card-title>
            </v-card>
          </template>
        </v-hover>
      </v-slide-item>
    </v-slide-group>
    <v-select
      v-if="$accessor.app.personas.length > 0"
      v-model="selectedSender"
      outlined
      :items="possibleSenders"
      label="Sending message as"
    ></v-select>
    <v-textarea
      v-model="message"
      flat
      solo
      dense
      autocomplete="off"
      hide-details="auto"
      :label="$i18n.t('app.message-input')"
      append-icon="mdi-emoticon"
      prepend-icon="mdi-attachment"
      auto-grow
      background-color="transparent"
      :rows="1"
      class="message-input pt-1"
      @click:append="toggleEmojiPicker"
      @click:prepend="selectFileClicked"
      @keypress="onInputKeyPress"
      @paste="onPaste"
    />
    <input
      ref="fileUpload"
      type="file"
      hidden
      multiple
      @change="selectFileComplete"
    />
    <v-menu
      v-model="emojiOpen"
      :close-on-content-click="false"
      :position-x="emojiX"
      :position-y="emojiY"
      absolute
      top
      nudge-top="32"
    >
      <v-emoji-picker :dark="true" @select="pickEmoji" />
    </v-menu>
  </div>
</template>

<style scoped>
.invisible {
  visibility: hidden;
}

.root {
  background-color: var(--harmony-background-chrome-alt);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.message-input {
  max-height: 115px;
  overflow-y: auto;
  background-color: transparent;
  padding-top: 0 !important;
}

.typing-indicator {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { VEmojiPicker } from 'v-emoji-picker'
import _, { DebouncedFunc } from 'lodash'

interface IAttachment {
  file: File
  preview?: string
}

interface TypingMap {
  [userid: string]: Date
}

export default Vue.extend({
  components: {
    VEmojiPicker,
  },
  data() {
    return {
      message: '',
      emojiOpen: false,
      emojiX: 0,
      emojiY: 0,
      attachments: [] as IAttachment[],
      uploading: false,
      typingInterval: null as any,
      selectedSender: -1,
    }
  },
  computed: {
    debouncedTyping(): DebouncedFunc<() => void> {
      return _.debounce(this.sendTyping, 1000, { maxWait: 0, leading: true })
    },
    typers(): TypingMap | undefined {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.typing
    },
    typingDisplay(): string {
      if (!this.typers) return ''
      const filteredTypers = Object.keys(this.typers)
        .filter((v) => v !== this.$accessor.app.userID)
        .map(
          (userID) =>
            this.$accessor.app.data[this.$getHost()].users[userID].username,
        )
        .filter((v) => v !== undefined)
      if (filteredTypers.length === 0) return ''
      return this.$tc(
        'app.typing',
        filteredTypers.length,
        filteredTypers,
      ).toString()
    },
    possibleSenders(): any[] {
      const ownP = this.$accessor.app.data[this.$accessor.app.host!]?.users[
        this.$accessor.app.userID!
      ]
      return [{ text: ownP.username, value: -1 }].concat(
        this.$accessor.app.personas.map((item, idx) => {
          return { text: item.name, value: idx }
        }),
      )
    },
  },
  mounted() {
    this.typingInterval = setInterval(this.checkTyping, 500)
  },
  beforeDestroy() {
    clearInterval(this.typingInterval)
  },
  methods: {
    toggleEmojiPicker(e: MouseEvent) {
      this.emojiX = e.clientX
      this.emojiY = e.clientY
      this.emojiOpen = true
    },
    pickEmoji(emoji: any) {
      this.message += emoji.data
    },
    selectFileClicked() {
      ;(this.$refs.fileUpload as HTMLInputElement).click()
    },
    selectFileComplete(e: Event) {
      const input = e.target as HTMLInputElement
      if (input.files) {
        this.attachments = [
          ...this.attachments,
          ...Array.from(input.files).map<IAttachment>((f) => ({
            file: f,
            preview: URL.createObjectURL(f),
          })),
        ]
      }
    },
    async onInputKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.uploading = true
        const localID = Math.floor(Math.random() * 1000)
        const sendMsg = this.message
        this.message = ''
        this.$accessor.app.addMessage({
          host: this.$getHost(),
          channelID: this.$route.params.channelid,
          messageID: localID.toString(),
          data: {
            authorID: this.$accessor.app.userID || '',
            createdAt: Date.now() / 1000,
            editedAt: 0,
            content: sendMsg,
            pending: true,
            embedsList: [],
            actionsList: [],
            attachmentsList: [],
          },
        })

        let uploadAttachments = undefined as string[] | undefined
        let uploadPromises = [] as Promise<void>[]
        if (this.attachments && this.attachments.length > 0) {
          uploadAttachments = []
          uploadPromises = this.attachments.map(async (f) => {
            const resp = await this.$uploadFile(this.$getHost(), f.file)
            if (f.preview) URL.revokeObjectURL(f.preview)
            uploadAttachments?.push(resp)
          })
        }

        await Promise.all(uploadPromises)

        this.uploading = false

        this.attachments = []

        await this.$sendMessage(
          this.$getHost(),
          this.$route.params.guildid,
          this.$route.params.channelid,
          sendMsg,
          uploadAttachments,
          localID,
        )
      }
      this.debouncedTyping()
    },
    deleteSelectedFile(idx: number) {
      if (this.attachments) {
        const preview = this.attachments[idx].preview
        if (preview) URL.revokeObjectURL(preview)
        Vue.delete(this.attachments, idx)
      }
    },
    onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (items !== undefined) {
        this.attachments = [
          ...this.attachments,
          ...Array.from(items).reduce<IAttachment[]>((prev, v) => {
            const f = v.getAsFile()
            if (!f) return prev
            const preview = URL.createObjectURL(f)
            prev.push({
              file: f,
              preview,
            })
            return prev
          }, []),
        ]
      }
    },
    checkTyping() {
      if (this.typers) {
        Object.keys(this.typers).forEach((t) => {
          if (new Date().getTime() - this.typers![t].getTime() > 2000) {
            this.$accessor.app.deleteTyper({
              host: this.$getHost(),
              channelID: this.$route.params.channelid,
              userID: t,
            })
          }
        })
      }
    },
    sendTyping() {
      console.log('sending typing')
      this.$sendTyping(
        this.$getHost(),
        this.$route.params.guildid,
        this.$route.params.channelid,
      )
    },
  },
})
</script>
