<template>
  <div class="root">
    <v-sheet class="body pa-6" rounded>
      <nuxt-child />
    </v-sheet>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body {
  width: 60%;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    step() {
      return this.$accessor.entry.step
    },
  },
  beforeCreate() {
    if (this.$route.fullPath === '/entry') {
      this.$router.push('/entry/serverselect')
    }
  },
})
</script>
