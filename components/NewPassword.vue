<template>
  <div>
    <v-text-field
      v-model="password"
      type="password"
      hide-details="auto"
      outlined
      :label="$i18n.t('auth.password')"
      class="mt-2"
      @input="onEdited"
    />
    <v-text-field
      v-model="confirmPassword"
      type="password"
      hide-details="auto"
      outlined
      :label="$i18n.t('auth.confirm-password')"
      class="mt-2"
      @input="onEdited"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      password: '' as string,
      confirmPassword: '' as string,
    }
  },
  methods: {
    onEdited() {
      if (this.password === this.confirmPassword) {
        this.$emit('input', this.password)
      } else {
        this.$emit('input', undefined)
      }
    },
  },
})
</script>
