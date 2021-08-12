<script setup lang="ts">
import { ref, defineEmit } from "vue";
import HInput from "./HInput.vue";

const emit = defineEmits(["update:modelValue"]);

const pass = ref("");
const confirmPass = ref("");

const onEdited = () => {
  if (pass.value === confirmPass.value) {
    emit("update:modelValue", pass.value);
  } else {
    emit("update:modelValue", undefined);
  }
};
</script>
<template>
  <div class="mb-4">
    <h-input
      v-model="pass"
      :label="$t('auth.password')"
      type="password"
      @input="onEdited"
    />
  </div>
  <div class="mb-2">
    <h-input
      v-model="confirmPass"
      :label="$t('auth.confirm-password')"
      type="password"
      @input="onEdited"
    />
  </div>
  <p
    v-t="'auth.mismatched-passwords'"
    :class="{ invisible: pass === confirmPass, 'text-red-400': true }"
  />
</template>

<style lang="postcss" scoped>
.invisible {
  @apply invisible;
}
</style>
