<template>
  <fragment>
    <v-app-bar app fixed color="transparent" flat>
      <v-toolbar-title>{{ $i18n.t('app-name') }}</v-toolbar-title>
      <v-spacer />
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon> mdi-translate </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(lang, idx) in $i18n.locales || []"
            :key="idx"
            link
            @click="$i18n.setLocale(lang.code)"
          >
            <v-list-item-title>{{ lang.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
    dialogData() {
      return this.$accessor.dialog.dialog
    },
  },
  beforeCreate() {
    if (this.$accessor.app.session !== undefined) this.$router.push('/app')
    if (this.$route.fullPath === '/entry') {
      this.$router.push('/entry/serverselect')
    }
  },
  methods: {
    closeDialog() {
      this.$accessor.dialog.closeDialog()
    },
  },
})
</script>
