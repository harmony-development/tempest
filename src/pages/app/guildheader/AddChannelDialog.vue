<script lang="ts" setup>
import { CreateChannelRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/channels";

import { useVModel } from "@vueuse/core";
import { defineEmit, defineProps, ref } from "vue";
import HDialog from "~/components/HDialog.vue"
import HInput from "~/components/HInput.vue"
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";

const props = defineProps<{
    modelValue: boolean
}>()
const emit = defineEmit(['update:modelValue'])
const open = useVModel(props, 'modelValue', emit)

const route = useAppRoute()
const name = ref("")

const doneClicked = async () => {
    const conn = await getOrFederate(route.value.host)
    await conn.chat.createChannel(CreateChannelRequest.create({
        guildId: route.value.guildid as string,
        channelName: name.value,
        isCategory: false,
    }))
}
</script>

<template>
    <h-dialog v-model="open">
        <h1 v-t="'app.add-channel-dialog.title'" class="text-lg" />
        <h-input
        v-model="name"
        :label="$t('app.add-channel-dialog.name')"
        class="border-harmonydark-500 mt-3"
        />
        <div class="flex mt-4 justify-end">
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
            </h-btn>
          </div>
    </h-dialog>
</template>