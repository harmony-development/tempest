<template>
  <fragment>
    <v-app-bar fixed color="transparent" flat>
      <v-toolbar-title>Staccato</v-toolbar-title>
      <v-spacer />
      <v-btn text>
        <v-icon> mdi-translate </v-icon>
      </v-btn>
    </v-app-bar>
    <div class="root">
      <v-sheet class="body pa-6" rounded>
        <nuxt-child />
      </v-sheet>
    </div>
  </fragment>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  background: url('~@/static/wiggle.svg');
  background-repeat: repeat;
  stroke: black;
}
.body {
  width: 30%;
  margin-left: 5%;
}

@media only screen and (max-width: 900px) {
  .body {
    width: 90%;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Fragment } from 'vue-fragment'

export default Vue.extend({
  components: {
    Fragment,
  },
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
