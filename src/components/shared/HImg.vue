<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
});
</script>

<script lang="ts" setup>
import { ref, defineComponent } from "vue";

defineProps<{
  fallback?: string;
}>();

const loadFailure = ref(false);
</script>

<template>
  <div v-if="loadFailure" class="flex justify-center h-full items-center">
    <p>{{ fallback }}</p>
  </div>
  <img v-bind="$attrs" @error="loadFailure = true" v-else />
</template>
