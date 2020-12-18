<template>
  <div>
    <h2 class="mb-2">Select A Server To Login To</h2>
    <v-dialog
      v-model="addServerDialog"
      max-width="290"
      @keydown.enter="addServer(addServerName, addServerHost)"
      @keydown.esc="addServerDialog = false"
    >
      <template v-slot:activator="{}">
        <v-btn
          class="mb-2"
          @click="
            $event.target.blur()
            addServerDialog = true
          "
          >Add Server</v-btn
        >
      </template>
      <v-card>
        <v-card-title> Add Server </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="addServerName"
            label="Server Name"
            required
            outlined
            autofocus
          />
          <v-text-field
            v-model="addServerHost"
            label="Server Host/IP"
            required
            outlined
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="addServerDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            text
            @click="addServer(addServerName, addServerHost)"
            >Done</v-btn
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
    <div class="bottom-navigation">
      <v-btn color="white" text disabled
        ><v-icon left>mdi-chevron-left</v-icon> BACK</v-btn
      >
      <v-btn
        color="primary"
        :disabled="serverList[selected] === undefined"
        @click="nextPage()"
        >NEXT <v-icon right>mdi-chevron-right</v-icon></v-btn
      >
    </div>
  </div>
</template>

<style scoped>
.server-select {
  width: 100%;
}
.bottom-navigation {
  display: flex;
  position: relative;
  justify-content: space-between;
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
      this.$router.push({
        path: `auth/login`,
        hash: encodeURIComponent(
          `https://${this.serverList[this.selected]?.host}`,
        ),
      })
      this.$accessor.entry.setStep(this.$accessor.entry.step + 1)
    },
  },
})
</script>
