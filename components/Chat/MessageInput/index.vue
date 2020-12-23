<template>
  <div class="ma-2">
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
                <v-overlay v-if="hover" absolute color="black">
                  <v-btn
                    icon
                    class="delete-btn"
                    @click="deleteSelectedFile(idx)"
                  >
                    <v-icon> mdi-close </v-icon>
                  </v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-img>
          </template>
        </v-hover>
      </v-slide-item>
    </v-slide-group>
    <v-text-field
      v-model="message"
      outlined
      autocomplete="off"
      hide-details="auto"
      label="Message"
      append-icon="mdi-emoticon"
      prepend-icon="mdi-plus"
      @click:append="toggleEmojiPicker"
      @click:prepend="selectFileClicked"
      @keypress="onInputKeyPress"
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

<style scoped></style>

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
        this.attachments = Array.from(input.files).map<IAttachment>((f) => ({
          file: f,
        }))
        this.genPreviews(input.files)
      }
    },
    genPreviews(files: FileList) {
      Array.from(files).forEach((file, idx) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (ev) => {
            if (typeof ev.target?.result === 'string') {
              Vue.set(this.attachments[idx], 'preview', ev.target.result)
            }
          }
          reader.readAsDataURL(file)
        }
      })
    },
    async onInputKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        const localID = `local${window.performance.now()}`
        this.$accessor.app.addMessage({
          host: this.$getHost(),
          channelID: this.$route.params.channelid,
          messageID: localID,
          data: {
            authorID: this.$accessor.app.userID || '',
            createdAt: window.performance.now(),
            editedAt: 0,
            content: this.message,
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
            uploadAttachments?.push(resp)
          })
        }

        await Promise.all(uploadPromises)
        await this.$sendMessage(
          this.$getHost(),
          this.$route.params.guildid,
          this.$route.params.channelid,
          this.message,
          uploadAttachments,
        )
        this.$accessor.app.deleteMessage({
          host: this.$getHost(),
          channelID: this.$route.params.channelid,
          messageID: localID,
        })
        this.message = ''
        this.attachments = []
      }
    },
    deleteSelectedFile(idx: number) {
      if (this.attachments) {
        Vue.delete(this.attachments, idx)
      }
    },
  },
})
</script>
