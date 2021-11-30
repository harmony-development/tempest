<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { computed, ref } from "@vue/reactivity";
import Preference from "./Preference.vue";
import { host, userID } from "~/logic/app";
import { appState } from "~/store/app";
import { getOrFederate } from "~/logic/connections";

const { t } = useI18n();

const user = computed(
  () =>
    (userID.value && appState.getUser(host.value, userID.value)) || undefined
);

// const userAvatarSrc = computed(() =>
// user.value?.avatar ? parseHMC(user.value.avatar) : undefined
// );

const saving = ref<boolean | undefined>(undefined);

const pending = ref<{
  avatar?: File;
  username?: string;
}>({
  avatar: undefined,
  username: undefined,
});

const reset = () => (pending.value = {});

const saveProfile = async () => {
  saving.value = true;
  const { avatar, username } = pending.value;
  const conn = await getOrFederate(host.value);

  const res = avatar && (await conn.uploadFile(avatar));

  const avatarID = res?.id;

  await conn.profile.updateProfile({
    newUserName: username,
    newUserAvatar: avatarID,
  });
  saving.value = false;
};
</script>

<template>
  <h-card class="flex flex-col gap-4">
    <div class="flex flex-col items-center gap-1">
      <!-- <changeable-image
        v-model="avatar"
        v-wave
        :src=""
        class="mb-4 w-24 rounded-full select-none cursor-pointer"
        style="aspect-ratio: 1"
      /> -->
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
