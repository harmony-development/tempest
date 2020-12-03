<template>
  <v-avatar :width="width" :height="height">
    <img class="img" :src="src" alt=" " />
  </v-avatar>
</template>

<style scoped>
.img {
  border-radius: 100%;
  background-color: gray;
  width: 100%;
  padding-bottom: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    height: {
      type: String,
      default: '64px',
    },
    width: {
      type: String,
      default: '64px',
    },
    src: {
      type: String,
      default: '',
    },
  },
})
</script>
