<template>
  <fragment>
    <h2 class="mb-2 text-xl">{{ title }}</h2>
    <h-dialog>
      <template slot="activator" slot-scope="{ toggle }">
        <btn filled class="mb-2" @click.native="toggle">{{
          $i18n.t('server-select.add-btn')
        }}</btn>
      </template>
      <paper class="p-4">
        <h1>hi</h1>
      </paper>
    </h-dialog>
    <list>
      <list-item selected>A</list-item>
    </list>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import HDialog from '~/components/HDialog.vue'

export default Vue.extend({
  components: {
    HDialog,
  },
  computed: {
    title() {
      return this.$t('server-select.title')
    },
  },
})
</script>
