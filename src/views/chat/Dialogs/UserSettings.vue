<template>
  <form class="p-2 flexcol gap-4" @submit.prevent="onSubmit">
    <div class="flex justify-center">
      <ImageInput
        :preview-src="profile?.picture"
        v-model="changedValues.avatar"
        :fallback="profile?.username.charAt(0) || '?'"
      />
    </div>
    <HInput
      name="username"
      :type="'username'"
      placeholder="Username"
      :model-value="displayValues.username"
      @input="(event) => changedValues.username = (event.target as HTMLInputElement).value"
    />
    <div class="flex justify-end gap-2">
      <HBtn
        variant="outlined"
        type="reset"
        @click="handleReset"
        :disabled="dirty"
        >Reset</HBtn
      >
      <HBtn
        button
        variant="outlined"
        color="primary"
        type="submit"
        :disabled="dirty"
        >Save</HBtn
      >
    </div>
  </form>
</template>

<script lang="ts" setup>
import { Form } from "vee-validate";
import { computed, Ref, ref } from "vue";
import ImageInput from "~/components/chat/ImageInput.vue";
import HBtn from "~/components/shared/HBtn.vue";
import HInput from "~/components/shared/HInput.vue";
import { connectionManager } from "~/logic/api/connections";
import { session } from "~/logic/store/session";
import { chatState } from "../../../logic/store/chat";

interface ISettings {
  avatar?: File;
  username?: string;
  [key: string]: any;
}

const profile = computed(() =>
  session.value
    ? chatState.getUser(session.value.host, session.value.userID)
    : undefined
);

const defaultValues = computed<ISettings>(() => ({
  avatar: undefined,
  avatarPreview: profile.value?.picture,
  username: profile.value?.username,
}));
const changedValues = <Ref<typeof defaultValues.value>>ref({});
const displayValues = computed(() => ({
  ...defaultValues.value,
  ...changedValues.value,
}));

const dirty = computed(() =>
  Object.entries(changedValues.value).every(
    ([key, value]) => defaultValues.value[key] === value
  )
);

const onSubmit = async () => {
  const { username, avatar } = changedValues.value;
  const conn = connectionManager.get(session.value!.host);
  let newUserAvatar: string | undefined;
  if (avatar) {
    const result = await conn.uploadFile(avatar);
    newUserAvatar = result.id;
  }
  await conn.profile.updateProfile({
    newUserAvatar,
    newUserName: username,
  });
  handleReset();
};

const handleReset = () => {
  changedValues.value = {};
};
</script>
