<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { computed, reactive, ref } from "@vue/reactivity";
import Preference from "./Preference.vue";
import HImage from "~/components/shared/Image/HImage.vue";
import { host, userID } from "~/logic/app";
import { appState } from "~/store/app";
import { selectFile } from "~/logic/utils/fileSelect";
import { resetObject } from "~/logic/utils/common";
import { getOrFederate } from "~/logic/connections";

const { t } = useI18n();

const user = computed(
  () =>
    (userID.value && appState.getUser(host.value, userID.value)) || undefined
);

const pending = reactive<{
  _previewAvatar?: string;
  avatar?: File;
  username?: string;
  isBot?: boolean;
}>({
  _previewAvatar: undefined,
  username: undefined,
  avatar: undefined,
  isBot: undefined,
});

const fileUpload = ref<HTMLInputElement | undefined>();
const saving = ref<boolean | undefined>(undefined);

const isProfileUnchanged = computed(() =>
  Object.entries(pending).every(([key, value]) => {
    return key.startsWith("_") || !value || user.value?.[key] === value;
  })
);

const reset = () => {
  pending._previewAvatar && URL.revokeObjectURL(pending._previewAvatar);
  resetObject(pending);
};

const onAvatarClick = async () => {
  pending._previewAvatar && URL.revokeObjectURL(pending._previewAvatar);

  const res = await selectFile(fileUpload.value!);
  if (!res) return;

  const selectedFile = res[0];
  if (!selectedFile) return;

  pending._previewAvatar = URL.createObjectURL(selectedFile);
  pending.avatar = selectedFile;
};

const saveProfile = async () => {
  saving.value = true;
  const conn = await getOrFederate(host.value);

  const res = pending.avatar && (await conn.uploadFile(pending.avatar));

  const avatarID = res?.id;

  await conn.profile.updateProfile({
    newUserName: pending.username,
    newUserAvatar: avatarID,
  });
  reset();
  saving.value = false;
};
</script>

<template>
  <h-card class="flex flex-col gap-4">
    <div class="flex flex-col items-center gap-1">
      <input ref="fileUpload" type="file" hidden />
      <HImage
        v-wave
        :userid="userID"
        :uri="pending._previewAvatar"
        class="mb-4 w-24 rounded-full select-none cursor-pointer"
        style="aspect-ratio: 1"
        @click="onAvatarClick"
      />
      <Preference
        :name="t('app.user-settings.username')"
        :model-value="pending.username || user?.username"
        @update:model-value="(value) => (pending.username = value)"
      />
    </div>
    <div class="flex justify-end gap-2">
      <h-btn-v2
        v-t="'app.user-settings.reset'"
        :disabled="isProfileUnchanged"
        @click="reset"
      />
      <h-btn-v2
        outlined
        :disabled="isProfileUnchanged"
        :loading="saving"
        @click="saveProfile"
      >
        {{ t("app.user-settings.save") }}
      </h-btn-v2>
    </div>
  </h-card>
</template>
