<template>
  <fragment>
    <h2 class="mb-2 text-xl">{{ title }}</h2>
    <h-dialog v-model="addServerOpen">
      <template slot="activator">
        <btn filled class="mb-2" @click.native="addServerOpen = true">{{
          $t('server-select.add-btn')
        }}</btn>
      </template>
      <paper class="p-4 w-1/5">
        <h1 class="text-xl mb-3">
          {{ $i18n.t('server-select.add-dialog.title') }}
        </h1>
        <h-text-field
          class="w-full"
          :placeholder="$t('server-select.add-dialog.name')"
        />
        <div class="flex mt-4">
          <spacer />
          <btn flat text color="secondary" @click.native="addServerOpen = false"
            >Cancel</btn
          >
          <btn flat text class="ml-2">Done</btn>
        </div>
      </paper>
    </h-dialog>
    <list>
      <list-item selected>A</list-item>
    </list>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Btn from '~/components/Btn.vue'
import HDialog from '~/components/HDialog.vue'
import HTextField from '~/components/HTextField.vue'
import Spacer from '~/components/Spacer.vue'

export default Vue.extend({
  components: {
    HDialog,
    HTextField,
    Btn,
    Spacer,
  },
  data() {
    return {
      addServerOpen: false,
    }
  },
  computed: {
    title() {
      return this.$t('server-select.title')
    },
  },
})
</script>
