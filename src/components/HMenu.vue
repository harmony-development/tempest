<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

const x = ref(0)
const y = ref(0)
const open = ref(false)
const menu = ref<HTMLDivElement | null>(null)

function onClickAway() {
	open.value = false
}

async function toggle(ev: MouseEvent) {
  open.value = true
  await nextTick()
  const el = ev.currentTarget as Element
  const activatorBbox = el.getBoundingClientRect()
  const menuBbox = menu.value!.getBoundingClientRect()

  x.value = activatorBbox.x - menuBbox.width + activatorBbox.width
  y.value = activatorBbox.y + activatorBbox.height
}

const menuStyle = computed(() => {
  return {
    top: `${y.value}px`,
    left: `${x.value}px`,
  }
})
</script>

<template>
  <slot name="activator" :toggle="toggle" />
  <Teleport to="#app">
		<div v-show="open" class="h-screen top-0 left-0 w-screen fixed" @click="onClickAway">
      <div ref="menu" class="z-50 fixed" :style="menuStyle">
        <slot />
      </div></div>
  </Teleport>
</template>
