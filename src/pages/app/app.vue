<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { session, host, isLoggedIn } from "~/logics/app";
import { getChatStream } from "~/logics/connections";

const router = useRouter();

onMounted(async () => {
  if (!isLoggedIn()) {
    router.push("/entry/serverselect");
    return;
  }
  await getChatStream(host.value, session.value);
});
</script>
<template>
  <div class="flex h-full w-full">
    <div class="bg-harmonydark-700 p-3">guild list</div>
    <div class="bg-harmonydark-800 p-3">channel list</div>
    <div class="flex flex-col flex-1">
      <div class="flex-1 p-4 overflow-x-auto">
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
      </div>
      <div class="bg-harmonydark-700 p-3">Text Input</div>
    </div>
    <div class="bg-harmonydark-800 p-3">member list</div>
  </div>
</template>