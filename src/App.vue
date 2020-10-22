<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import "@/assets/fix.css";
import Component from "vue-class-component";

@Component({})
export default class App extends Vue {}
</script>
