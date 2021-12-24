<template>
  <Form
    class="p-2 flex flex-col gap-4"
    v-slot="{ meta, handleReset, handleSubmit, submitCount }"
    :initial-values="defaultValues"
    @submit="onSubmit"
  >
    {{ submitCount }}
    <Field name="avatar" v-slot="{ handleChange, handleBlur }">
      <input
        ref="avatarInput"
        accept="image/*"
        class="hidden"
        type="file"
        @change="handleChange"
        @blur="handleBlur"
      />
      <div class="flex justify-center">
        <HImg
          class="w-32 h-32 bg-surface-300 rounded-full cursor-pointer"
          v-wave
          @click="avatarInput?.click()"
        />
      </div>
    </Field>
    <HFormInput name="username" :type="'username'" placeholder="Username" />
    <div class="flex justify-end gap-2">
      <HBtn variant="outlined" type="reset" @click="handleReset" :disabled="!meta.dirty">Reset</HBtn>
      <HBtn
        variant="outlined"
        color="primary"
        type="submit"
        :disabled="!meta.dirty || !meta.valid"
        @click="handleSubmit"
      >Save</HBtn>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Field, Form } from 'vee-validate';
import { computed, ref } from 'vue';
import { object, string } from 'yup';
import HBtn from '~/components/shared/HBtn.vue';
import HFormInput from '~/components/shared/HFormInput.vue';
import HImg from '~/components/shared/HImg.vue';
import { session } from '~/logic/store/session';
import { chatState } from '../../../logic/store/chat';

const avatarInput = ref<HTMLInputElement | undefined>()

const profile = computed(() => session.value ? chatState.getUser(session.value.host, session.value.userID) : undefined);

const defaultValues = computed(() => ({
  username: profile.value?.username
}))

const schema = object({
  username: string(),
  avatar: string(),
})

function onSubmit() {
  alert("insane")
  // const conn = connectionManager.get(session.value!.host);
  // conn.profile.updateProfile({
  //   username: 
  // })
}
</script>
