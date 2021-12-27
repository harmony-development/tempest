<template>
  <div>
    <input type="checkbox">
    <label>Hello</label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
	name: string
}>();
defineEmits([]);

</script>

<style scoped lang="postcss">

</style>
