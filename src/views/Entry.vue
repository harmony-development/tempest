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
  background: url("/public/wiggle.svg");
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
import EntryState from "@/store/entry";
import Vue from "vue";
import Component from "vue-class-component";
import { Fragment } from "vue-fragment";
import { getModule } from "vuex-module-decorators";

@Component
export default class Entry extends Vue {
  beforeCreate() {
    if (this.$route.fullPath === "/entry") {
      this.$router.push("/entry/serverselect");
    }
  }

  get step() {
    return getModule(EntryState).step;
  }
}
</script>
