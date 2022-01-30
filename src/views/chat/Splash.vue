<script lang="ts" setup>
import BaseSpinner from "~/components/base/BaseSpinner.vue";
</script>

<template>
  <div class="grid place-items-center h-full w-full">
    <div class="flex gap-2 flex-col items-center">
      <base-spinner class="text-6xl" />
      <p class="uppercase font-bold text-lg">
        {{ $t('connecting-to-server') }}
      </p>
      <span class="text-gray-400">{{ $t('issues-connecting') }}</span>
      <a class="text-primary-300" @click="$router.push({ name: 'serverselect' })">{{ $t('return-to-main-menu') }}</a>
    </div>
  </div>
</template>
