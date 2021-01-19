<template>
  <fragment>
    <h2 class="mb-2 text-xl">{{ title }}</h2>
    <h-dialog v-model="addServerOpen">
      <template slot="activator">
        <h-btn filled class="mb-2" @click.native="addServerOpen = true">{{
          $t('server-select.add-btn')
        }}</h-btn>
      </template>
      <paper class="p-4 w-1/5">
        <h1 class="text-xl mb-3">
          {{ $i18n.t('server-select.add-dialog.title') }}
        </h1>
        <h-text-field
          v-model="addServerName"
          class="w-full"
          :placeholder="$t('server-select.add-dialog.name')"
        />
        <h-text-field
          v-model="addServerHost"
          class="w-full mt-4"
          :placeholder="$t('server-select.add-dialog.host')"
        />
        <div class="flex mt-4">
          <spacer />
          <h-btn
            flat
            text
            color="secondary"
            @click.native="addServerOpen = false"
          >
            {{ $t('cancel') }}
          </h-btn>
          <h-btn
            flat
            text
            class="ml-2"
            :disabled="!addServerHost || !addServerName"
            @click.native="addServer(addServerName, addServerHost)"
            >{{ $t('done') }}</h-btn
          >
        </div>
      </paper>
    </h-dialog>
    <list>
      <client-only>
        <list-item
          v-for="(host, idx) in serverList"
          :key="host.host"
          :selected="host.host === selected"
          @click.native="selected = host.host"
        >
          <div class="flex-1">
            <list-item-text>{{ host.name }}</list-item-text>
            <list-item-text secondary>{{ host.host }}</list-item-text>
          </div>
          <h-btn
            text
            icon
            flat
            @pointerdown.native.stop=""
            @click.native.stop="removeServer(idx)"
          >
            <h-icon icon="mdiDelete" />
          </h-btn>
        </list-item>
      </client-only>
    </list>
    <div class="flex justify-end mt-2">
      <h-btn class="mr-2" text disabled flat>
        {{ $i18n.t('back') }}
      </h-btn>
      <h-btn :disabled="!selected" filled @click.native="nextPage">
        {{ $i18n.t('next') }}
        <h-icon icon="mdiChevronRight" />
      </h-btn>
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import HBtn from '~/components/HBtn.vue'
import HDialog from '~/components/HDialog.vue'
import HTextField from '~/components/HTextField.vue'
import Spacer from '~/components/Spacer.vue'
import { IServerEntry } from '~/store/entry'

export default Vue.extend({
  components: {
    HDialog,
    HTextField,
    HBtn,
    Spacer,
  },
  data() {
    return {
      selected: undefined as string | undefined,
      addServerOpen: false,
      addServerName: '',
      addServerHost: '',
    }
  },
  computed: {
    title(): TranslateResult {
      return this.$t('server-select.title')
    },
    serverList(): IServerEntry[] {
      return this.$accessor.entry.serverList
    },
  },
  methods: {
    removeServer(idx: number) {
      this.$accessor.entry.removeServerFromList(idx)
    },
    addServer(name: string, host: string) {
      this.$accessor.entry.addServerToList({
        name,
        host,
      })
      this.addServerOpen = false
    },
    nextPage() {
      let host = this.selected!

      if (host.includes('://'))
        host = `https${host.substr(host.indexOf('://'))}`
      else host = `https://${host}`

      const parsed = new URL(host)

      this.$router.push({
        path: `auth`,
        hash: encodeURIComponent(
          `https://${parsed.hostname}:${parsed.port || '2289'}`
        ),
      })
      this.$accessor.entry.setStep(this.$accessor.entry.step + 1)
    },
  },
})
</script>
