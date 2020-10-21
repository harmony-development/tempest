<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-img
        v-ripple
        :src="icon"
        class="img-content mb-2"
        max-width="64"
        max-height="64"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    {{ name }}
  </v-tooltip>
</template>

<style scoped>
.img-content {
  width: 100%;
  object-fit: cover;
  background-color: black;
  border-radius: 100%;
  cursor: pointer;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    name: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
})
</script>
