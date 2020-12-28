<template>
  <div class="ml-2 mr-2 mb-2">
    <v-slide-group multiple show-arrows class="mb-2">
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
          </template>
        </v-hover>
      </v-slide-item>
    </v-slide-group>
    <v-textarea
      v-model="message"
      outlined
      dense
      autocomplete="off"
      hide-details="auto"
      label="Message"
      append-icon="mdi-emoticon"
      prepend-icon="mdi-plus"
      auto-grow
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
.message-input {
  max-height: 115px;
  overflow-y: auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { VEmojiPicker } from 'v-emoji-picker'

interface IAttachment {
  file: File
  preview?: string
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
    }
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
  },
})
</script>
