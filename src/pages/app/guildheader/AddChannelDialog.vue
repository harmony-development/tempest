<script lang="ts" setup>
import { CreateChannelRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/channels";

import { useVModel } from "@vueuse/core";
import { defineEmit, defineProps, ref } from "vue";
import { RpcError } from "@protobuf-ts/runtime-rpc";
import HDialog from "~/components/HDialog.vue";
import HInput from "~/components/HInput.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import HSpinner from "~/components/HSpinner.vue";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmit(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
const route = useAppRoute();

const loading = ref(false);
const error = ref<RpcError | undefined>(undefined);
const name = ref("");

const doneClicked = async () => {
  try {
    loading.value = true;
    const conn = await getOrFederate(route.value.host);
    await conn.chat.createChannel(
      CreateChannelRequest.create({
        guildId: route.value.guildid as string,
        channelName: name.value,
        isCategory: false,
      })
    );
    open.value = false;
    loading.value = false;
  } catch (e) {
    error.value = e;
    loading.value = false;
  }
};
</script>

<template>
  <h-dialog v-model="open">
    <h1 v-t="'app.add-channel-dialog.title'" class="text-lg" />
    <h-input
      v-model="name"
      :label="$t('app.add-channel-dialog.name')"
      class="mt-3"
    />
    <p class="text-red-400 mt-2">{{ error?.code }}</p>
    <div class="flex justify-end">
      <h-btn
        variant="text"
        color="secondary"
        class="mr-2"
        @click="open = false"
      >
        Cancel
      </h-btn>
      <h-btn
        variant="text"
        color="primary"
        :disabled="!name"
        @click="doneClicked"
      >
        Done
        <h-spinner v-if="loading" />
        <template v-else v-t="'buttons.done'" />
      </h-btn>
    </div>
  </h-dialog>
</template>
