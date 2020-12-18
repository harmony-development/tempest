<template>
  <v-dialog
    :value="dialogState.open"
    max-width="800"
    content-class="elevation-0"
    transition="slide-y-transition"
    @input="this.$accessor.imageView.closeDialog"
  >
    <img :src="dialogState.imageID" class="attachment" />
    <div class="footer">
      <a class="open-original" :href="dialogState.imageID" target="_blank"
        >Open Original</a
      >
    </div>
  </v-dialog>
</template>

<style scoped>
.attachment {
  width: 100%;
}

.footer {
}

.open-original {
  margin-left: auto;
  color: white;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    dialogState() {
      return this.$accessor.imageView
    },
  },
})
</script>
