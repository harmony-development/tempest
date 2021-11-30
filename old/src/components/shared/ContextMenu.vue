<script lang="ts" setup>
const top = ref(0);
const left = ref(0);
const open = ref(false);
const menuContainer = ref<HTMLElement | undefined>(undefined);

const pixelTop = computed(() => `${top.value}px`);
const pixelLeft = computed(() => `${left.value}px`);

const positionStyles = computed(() => ({
  top: pixelTop.value,
  left: pixelLeft.value,
}));

function openMenu({ x, y }: MouseEvent) {
  left.value = x;
  top.value = y;
  open.value = true;
}

onClickOutside(menuContainer, (ev) => {
  open.value = false;
});
</script>

<template>
  <slot name="activator" :open="openMenu" />
  <div v-if="open" ref="menuContainer" class="fixed" :style="positionStyles">
    <slot />
  </div>
</template>
