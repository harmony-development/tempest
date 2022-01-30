<template>
  <form class="p-2 flexcol gap-4" @submit.prevent="onSubmit">
    <div class="flex justify-center">
      <image-input
        v-model="changedValues.avatar"
        :preview-src="avatarURL"
        :fallback="profile?.username.charAt(0) || '?'"
      />
    </div>
    <base-input
      name="username"
      :type="'username'"
      :placeholder="$t('username')"
      :model-value="displayValues.username"
      @input="(event) => changedValues.username = (event.target as HTMLInputElement).value"
    />
    <base-checkbox
      name="Bot"
      :model-value="displayValues.bot"
      @update:model-value="changedValues.bot = $event"
    />
    <div class="flex justify-end gap-2">
      <base-button variant="outlined" type="reset" :disabled="dirty" @click="handleReset">
        {{ $t('reset') }}
      </base-button>
      <base-button button variant="outlined" color="primary" type="submit" :disabled="dirty">
        {{ $t('save') }}
      </base-button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { parseHMC } from "../../../logic/parsing";
import { chatState } from "../../../logic/store/chat";
import { useAPI } from "../../../services/api";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInput from "~/components/base/BaseInput.vue";
import ImageInput from "~/components/chat/ImageInput.vue";
import { session } from "~/logic/store/session";
import BaseCheckbox from "~/components/base/BaseCheckbox.vue";
interface ISettings {
	avatar?: File
	username?: string
	bot?: boolean
	[key: string]: any
}

const api = useAPI();

const profile = computed(() => (session.value ? chatState.getUser("", session.value.userID) : undefined));
const avatarURL = computed(() => (session.value?.host && profile.value?.picture) ? parseHMC(profile.value.picture, session.value.host) : undefined);
const defaultValues = computed<ISettings>(() => ({
	avatar: undefined,
	avatarPreview: profile.value?.picture,
	username: profile.value?.username,
	bot: profile.value?.isBot,
}));
const changedValues = ref({}) as Ref<typeof defaultValues.value>;
const displayValues = computed(() => ({
	...defaultValues.value,
	...changedValues.value,
}));

const dirty = computed(() =>
	Object.entries(changedValues.value).every(([key, value]) => defaultValues.value[key] === value),
);

const handleReset = () => {
	changedValues.value = {};
};

const onSubmit = async() => {
	const { username, avatar, bot } = changedValues.value;
	await api.updateProfile(session.value!.host, username, avatar, bot);
	handleReset();
};
</script>
