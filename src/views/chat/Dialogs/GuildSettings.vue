<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { chatState } from "../../../logic/store/chat";
import { uiState } from "../../../logic/store/ui";
import { useAPI } from "../../../services/api";
import ImageInput from "~/components/chat/ImageInput.vue";
import { parseHMC } from "~/logic/parsing";
import BaseInput from "~/components/base/BaseInput.vue";
import { useForm } from "~/logic/composition/useForm";

interface ISettings {
	picture?: File
	name?: string
	[key: string]: any
}

const props = defineProps<{
	host: string
	guildId: string
}>();

const api = useAPI();

const guildData = computed(() => chatState.getGuild(
	props.host,
	props.guildId,
).data);
const name = computed(() => guildData.value?.name);
const picture = computed(() => guildData.value?.picture);
const pictureURL = computed(() => picture.value && parseHMC(picture.value, props.host));

const defaultValues = computed<ISettings>(() => ({
	picture: undefined,
	picturePreview: guildData.value?.picture,
	name: guildData.value?.name,
}));

const { displayValues, isDirty, changedValues, reset } = useForm<ISettings>(defaultValues);

const changePicture = ref(false);

const close = () => uiState.state.guildSettingsDialog = false;

const save = async() => {
	await api.updateGuild(props.host, props.guildId, changedValues.value.name, changedValues.value.picture);
	reset();
};
</script>
<template>
  <form class="flexcol gap-8 w-90vw md:w-140" @submit.prevent>
    <h1 class="text-2xl">
      {{ $t('guild-settings') }}
    </h1>
    <div class="flexcol gap-8 md:flex-row w-full justify-center">
      <div class="flexcol items-center gap-2">
        <image-input v-model="changedValues.picture" class="border-primary-400 border-3" :preview-src="pictureURL" :change="changePicture" />
        <a class="uppercase" @click="changePicture = !changePicture">{{ $t('change-picture') }}</a>
      </div>
      <div>
        <base-input :model-value="displayValues.name" outlined :placeholder="$t('guild-name')" @input="(event) => changedValues.name = (event.target as HTMLInputElement).value" />
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <base-button variant="text" type="button" @click="close">
        {{ $t('cancel') }}
      </base-button>
      <base-button variant="text" type="button" :disabled="isDirty" @click="reset">
        {{ $t('reset') }}
      </base-button>
      <base-button
        variant="text"
        color="primary"
        type="submit"
        :disabled="isDirty"
        @click="save"
      >
        {{ $t('save') }}
      </base-button>
    </div>
  </form>
</template>
