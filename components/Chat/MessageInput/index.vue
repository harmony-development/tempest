<template>
  <div class="ma-2">
    <div class="preview-thumbnails flex-nowrap">
      <v-img
        v-for="img in previewImages"
        :key="img"
        :src="img"
        class="grey lighten-2"
        max-height="100"
        max-width="177"
      />
    </div>
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
.preview-thumbnails {
  display: flex;
  flex: 1 0 0;
  overflow-x: auto;
  min-width: 0;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { VEmojiPicker } from 'v-emoji-picker'

const getBase64List = async (list: FileList) => {
  const promises = Array.from(list).map((file) => {
    const reader = new FileReader()
    return new Promise<string>((resolve) => {
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          resolve(ev.target.result)
        }
      }
      reader.readAsDataURL(file)
    })
  })
  return await Promise.all(promises)
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
      selectedFiles: null as FileList | null,
      previewImages: [] as string[],
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
    async selectFileComplete(e: Event) {
      const input = e.target as HTMLInputElement
      if (input.files) {
        this.selectedFiles = input.files
        this.previewImages = await getBase64List(input.files)
      }
    },
  },
})
</script>
