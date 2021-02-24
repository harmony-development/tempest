<template>
  <div
    class="h-full w-full flex items-center justify-center sm:justify-start background"
  >
    <div
      class="bg-harmonydark-800 w-11/12 sm:w-2/3 md:w-5/12 sm:m-12 p-6 rounded"
    >
      <router-view />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.background {
  background: url("../../assets/wiggle.svg");
  background-repeat: repeat;
  stroke: black;
}
</style>

<script lang="ts">
import Vue, { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      translateMenu: false,
    };
  },
});
</script>
