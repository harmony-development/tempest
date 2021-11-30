<script lang="ts" setup>
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { computed, defineProps } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  err?: Error;
}>();

const i18n = useI18n();

const errorText = computed(() => {
  if (props.err && props.err instanceof RpcError) {
    return i18n.t(props.err?.code, props.err?.message);
  }
  return props.err;
});
</script>

<template>
  <div>
    <h1 v-t="'app.error-occured.title'" class="text-lg" />
    <p class="text-gray-400">{{ errorText }}</p>
  </div>
</template>
