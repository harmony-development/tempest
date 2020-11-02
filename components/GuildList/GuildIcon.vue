<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-img
        v-ripple
        :class="iconStyle"
        max-width="64"
        max-height="64"
        v-bind="attrs"
        :src="picture"
        v-on="on"
        @click="onGuildIconClick"
      />
    </template>
    {{ name || id }}
  </v-tooltip>
</template>

<style scoped>
.img-content {
  width: 100%;
  object-fit: cover;
  background-color: black;
  border-radius: 100%;
  cursor: pointer;
  border: 2px solid transparent;
}

.selected {
  border: 2px solid var(--v-primary-base);
}
</style>

<script lang="ts">
import Vue from 'vue'
import { DialogType } from '~/store/dialog'
export default Vue.extend({
  props: {
    id: {
      type: String,
      default: '',
    },
    host: {
      type: String,
      default: '',
    },
  },
  computed: {
    name(): string | undefined {
      return this.$accessor.app.data[this.host]?.guilds[this.id]?.name
    },
    picture(): string | undefined {
      return this.$accessor.app.data[this.host]?.guilds[this.id]?.picture
    },
    iconStyle(): string {
      return `img-content mb-2 ${
        this.id === this.$route.params.guildid ? 'selected' : ''
      }`
    },
  },
  async mounted() {
    if (!this.name || !this.picture) {
      try {
        const conn = await this.$getOrFederate(this.host)
        const resp = await conn.getGuild(this.id)
        const asObj = resp.message!.toObject()
        this.$accessor.app.setGuildData({
          host: this.host,
          guildID: this.id,
          name: asObj.guildName,
          picture: asObj.guildPicture,
        })
      } catch (e) {
        this.$showDialog(DialogType.Error, e.statusMessage || e)
      }
    }
  },
  methods: {
    onGuildIconClick() {
      this.$router.push({
        path: `/app/${this.id}`,
        hash: this.host.replace('//', '///'),
      })
    },
  },
})
</script>
