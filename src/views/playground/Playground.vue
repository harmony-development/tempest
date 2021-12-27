<template>
  <div>
    <base-button @click="mom = false">
      Reset
    </base-button>
    <base-checkbox :checked="mom" name="Your Father?" @change="mom = $event.target.checked" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseCheckbox from "~/components/base/BaseCheckbox.vue";

const mom = ref(false);

// setInterval(() => mom.value = !mom.value, 72.7);
</script>

<style scoped lang="postcss">

</style>
