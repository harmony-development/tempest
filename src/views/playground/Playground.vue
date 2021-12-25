<template>
  <Form @submit="onSubmit" v-slot="{ meta, submitCount }">
    {{ submitCount }}
    <Field name="email" type="email" />
    <Field name="password" type="password" />
    <HBtn
      variant="outlined"
      color="primary"
      type="submit"
      :disabled="!meta.dirty || !meta.valid"
      button
    >Save</HBtn>
  </Form>
</template>
<script lang="ts" setup>
import { Field, Form } from 'vee-validate';
import HBtn from '~/components/shared/HBtn.vue';

function onSubmit(values) {
  // Submit values to API...
  alert(JSON.stringify(values, null, 2));
}
</script>