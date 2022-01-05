<script lang="ts" setup>
import BaseListItem from "./BaseListItem.vue";
interface IContextMenuItem {
	text: string
	handler?: () => void
}

const props = defineProps<{
	items?: IContextMenuItem[]
}>();
</script>

<template>
  <slot />
  <div>
    <base-list-item v-for="{text, handler} in items" :key="text" @click="handler">
      {{ text }}
    </base-list-item>
  </div>
</template>
