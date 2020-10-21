<template>
  <v-card flat>
    <v-card-title>Create Guild</v-card-title>
    <v-card-text>
      <host-list v-model="host" class="mb-2" />
      <v-text-field
        v-model="guildName"
        outlined
        label="Guild Name"
        hide-details="auto"
        class="mb-2"
      />
      <div>
        <a @click="$emit('join-guild-clicked')">Join A Guild?</a>
      </div>
      <div class="mt-2">
        <v-btn
          color="primary"
          :disabled="!host || !guildName"
          @click="createGuild"
          >Create Guild</v-btn
        >
        <v-btn text @click="$emit('cancelled')">Cancel</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import HostList from './HostList.vue'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  components: {
    HostList,
  },
  data() {
    return {
      host: undefined,
      guildName: undefined,
    }
  },
  methods: {
    async createGuild() {
      try {
        const conn = await this.$getOrFederate(this.host!)
        const resp = await conn.createGuild(this.guildName!)
        await conn.addGuildToGuildList(resp.message!.getGuildId(), this.host!)
        this.$accessor.app.addGuildToList({
          host: this.host!,
          guildId: resp.message!.getGuildId(),
        })
        this.$emit('cancelled')
      } catch (e) {
        this.$showDialog(DialogType.Error, e.statusMessage || e)
      }
    },
  },
})
</script>
