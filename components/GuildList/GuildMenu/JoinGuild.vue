<template>
  <v-card flat>
    <v-card-title>Join Guild</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="joinCode"
        outlined
        label="Invite Link"
        hide-details="auto"
        class="mb-2"
      >
        <template v-slot:append>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
            </template>
            Invites look like this: <br />
            asdf72 <br />
            harmony://example.com/asdf72
          </v-tooltip>
        </template>
      </v-text-field>
      <div>
        <a @click="$emit('create-guild-clicked')">Create A Guild?</a>
      </div>
      <div class="mt-2">
        <v-btn color="primary" :disabled="!joinCode" @click="joinGuild"
          >Join Guild</v-btn
        >
        <v-btn text @click="$emit('cancelled')">Cancel</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  data() {
    return {
      joinCode: undefined,
    }
  },
  methods: {
    async joinGuild() {
      let targetHost: string
      let targetCode: string
      try {
        const result = this.$parseHarmonyURI(this.joinCode!)
        targetHost = result.host
        targetCode = result.code
      } catch (e) {
        targetHost = this.$accessor.app.host!
        targetCode = this.joinCode!
      }
      try {
        const conn = await this.$getOrFederate(targetHost)
        const resp = await conn.joinGuild(targetCode)
        if (resp.message!.toObject().guildId) {
          await this.$addGuildToList(
            targetHost,
            resp.message!.toObject().guildId,
          )
        } else {
          console.log('guildID is null')
        }
      } catch (e) {
        console.error(e)
        this.$showDialog(DialogType.Error, e.statusMessage || e)
      }
    },
  },
})
</script>
