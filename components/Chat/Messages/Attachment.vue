<template>
  <div class="root">
    <img
      v-if="contentType.startsWith('image/')"
      :src="src"
      class="attachment img"
      @click="openImagePreview(typedData.id)"
    />
    <video
      v-else-if="contentType.startsWith('video/')"
      class="attachment"
      controls
    >
      <source :src="src" :type="contentType" />
    </video>
    <audio
      v-else-if="contentType.startsWith('audio/')"
      controls
      class="attachment"
      :src="src"
    />
    <v-card v-else outlined class="attachment">
      <v-card-title>
        {{ name }}
      </v-card-title>
      <v-card-text>
        <div class="subtitle-2">{{ size }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn icon target="_blank" :href="src" right>
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.attachment {
  width: 40%;
}

.attachment:hover {
  outline: none;
}

.attachment:focus {
  outline: none;
}

.img {
  cursor: pointer;
}

.root {
  width: 100%;
}

@media only screen and (max-width: 1200px) {
  .attachment {
    width: 66.66%;
  }
}
</style>

<script lang="ts">
import { Message } from '@harmony-dev/harmony-web-sdk/dist/protocol/core/v1/core_pb'
import Vue from 'vue'
export default Vue.extend({
  props: {
    data: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    typedData(): Message.Attachment.AsObject {
      return this.data as Message.Attachment.AsObject
    },
    contentType(): string {
      return this.typedData.type
    },
    size(): string {
      return this.formatBytes(this.typedData.size, 2)
    },
    name(): string {
      return this.typedData.name
    },
    src(): string {
      return `${this.$getHost()}/_harmony/media/download/${this.typedData.id}`
    },
  },
  methods: {
    openImagePreview(id: string) {
      this.$accessor.imageView.openDialog(id)
    },
    formatBytes(bytes: number, decimals: number) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals || 2
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
  },
})
</script>
