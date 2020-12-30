<template>
  <div>
    <h2 class="mb-2">{{ $i18n.t('server-select.title') }}</h2>
    <v-dialog
      v-model="addServerDialog"
      max-width="290"
      @keydown.enter="addServer(addServerName, addServerHost)"
      @keydown.esc="addServerDialog = false"
    >
      <template #activator="{}">
        <v-btn
          class="mb-2"
          @click="
            $event.target.blur()
            addServerDialog = true
          "
          >{{ $i18n.t('server-select.add-btn') }}</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          {{ $i18n.t('server-select.add-dialog.title') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="addServerName"
            :label="$i18n.t('server-select.add-dialog.name')"
            required
            outlined
            autofocus
          />
          <v-text-field
            v-model="addServerHost"
            :label="$i18n.t('server-select.add-dialog.host')"
            required
            outlined
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="addServerDialog = false">{{
            $i18n.t('cancel')
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="addServer(addServerName, addServerHost)"
            >{{ $i18n.t('done') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-sheet class="server-select mb-4">
      <v-list>
        <v-list-item-group v-model="selected" color="primary">
          <v-list-item v-for="(host, idx) in serverList" :key="host.host">
            <v-list-item-content>
              <v-list-item-title v-text="host.name"></v-list-item-title>
              <v-list-item-subtitle v-text="host.host"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="removeServer(idx)">
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>
    <div class="d-flex justify-end">
      <v-btn class="mt-2 mr-2" color="primary" text disabled>
        {{ $i18n.t('back') }}
      </v-btn>
      <v-btn
        color="primary"
        :disabled="serverList[selected] === undefined"
        class="mt-2"
        @click="nextPage()"
        >{{ $i18n.t('next') }} <v-icon right>mdi-chevron-right</v-icon></v-btn
      >
    </div>
  </div>
</template>

<style scoped>
.server-select {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      selected: 0,
      addServerDialog: false,
      addServerName: '',
      addServerHost: '',
    }
  },
  computed: {
    selectedServer() {
      return this.$accessor.entry.selectedServer
    },
    serverList() {
      return this.$accessor.entry.serverList
    },
  },
  mounted() {
    this.$accessor.entry.setStep(1)
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
      this.addServerDialog = false
    },
    nextPage() {
      let host = this.serverList[this.selected]?.host

      if (host.includes('://'))
        host = `https${host.substr(host.indexOf('://'))}`
      else host = `https://${host}`

      const parsed = new URL(host)

      this.$router.push({
        path: `auth`,
        hash: encodeURIComponent(
          `https://${parsed.hostname}:${parsed.port || '2289'}`,
        ),
      })
      this.$accessor.entry.setStep(this.$accessor.entry.step + 1)
    },
  },
})
</script>
