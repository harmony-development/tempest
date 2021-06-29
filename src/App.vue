<script setup lang="ts">
import { useHead } from "@vueuse/head";

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: "Tempest",
  meta: [{ name: "description", content: "Harmony web client" }],
});
</script>

<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <h-spinner />
    </template>
  </Suspense>
</template>
