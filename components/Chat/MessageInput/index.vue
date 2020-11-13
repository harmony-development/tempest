<template>
  <div>
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
    <v-text-field
      v-model="message"
      outlined
      hide-details="auto"
      label="Message"
      append-icon="mdi-emoticon"
      @click:append="toggleEmojiPicker"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VEmojiPicker } from 'v-emoji-picker'

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
  },
})
</script>
