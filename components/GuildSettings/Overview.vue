<template>
  <div class="fill-height">
    <v-row class="mb-2">
      <h1>Overview</h1>
    </v-row>
    <v-row class="mb-3">
      <v-col cols="12" md="5" lg="3">
        <v-row justify="center" class="mb-4">
          <v-btn icon width="auto" height="auto">
            <s-image width="100px" height="100px" />
          </v-btn>
        </v-row>
        <v-row justify="center">
          <v-btn outlined color="primary">Change Picture</v-btn>
        </v-row>
      </v-col>
      <v-col>
        <v-text-field
          outlined
          label="Guild Name"
          :value="displayName"
          @input="guildNameChange"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-snackbar :value="changed" :timeout="0">
      You have unsaved changes
      <template>
        <v-btn text class="ml-2 mr-2" @click="resetAll"> Cancel </v-btn>
        <v-btn color="green"> Save Changes </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SImage from '../SImage.vue'
export default Vue.extend({
  components: { SImage },
  data() {
    return {
      guildName: undefined as string | undefined,
    }
  },
  computed: {
    displayName(): string | undefined {
      if (this.guildName !== undefined) {
        return this.guildName
      } else {
        return this.$accessor.app.data[this.$getHost()]?.guilds[
          this.$route.params.guildid
        ]?.name
      }
    },
    guildNameChanged(): boolean {
      return (
        this.guildName !== undefined &&
        this.guildName !==
          this.$accessor.app.data[this.$getHost()]?.guilds[
            this.$route.params.guildid
          ]?.name
      )
    },
    changed(): boolean {
      return this.guildNameChanged
    },
  },
  methods: {
    guildNameChange(value: string) {
      this.guildName = value
      if (this.guildNameChanged) {
        this.changed = false
      }
      this.changed = true
    },
    resetAll() {
      Object.assign(this.$data, (this.$options as any).data())
    },
  },
})
</script>
