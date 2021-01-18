<template>
  <div>
    <h-text-field
      v-model="password"
      type="password"
      autocomplete="new-passowrd"
      :placeholder="$i18n.t('auth.password')"
      class="mt-2 w-full"
      @input.native="onEdited"
    />
    <h-text-field
      v-model="confirmPassword"
      type="password"
      autocomplete="new-passowrd"
      :placeholder="$t('auth.confirm-password')"
      class="mt-2 w-full"
      @input.native="onEdited"
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
