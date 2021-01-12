<template>
  <v-tooltip right>
    <template #activator="{ on, attrs }">
      <v-img
        v-ripple
        :class="iconStyle"
        max-width="64"
        max-height="64"
        v-bind="attrs"
        :src="picture"
        v-on="on"
        @click="onGuildIconClick"
        @contextmenu="onContextMenu"
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
  transition: border 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
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
      return this.$accessor.app.data[this.$guildIconHost(this.host)]?.guilds[
        this.id
      ]?.name
    },
    picture(): string | undefined {
      const pic = this.$accessor.app.data[this.$guildIconHost(this.host)]
        ?.guilds[this.id]?.picture

      if (!pic) return undefined

      const parsed = this.$parseMediaURI(this.host, pic)
      return parsed
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
        const conn = await this.$getOrFederate(this.$guildIconHost(this.host))
        const resp = await conn.getGuild(this.id)
        const asObj = resp.message!.toObject()
        conn.subscribe(this.id)
        this.$accessor.app.setGuildData({
          host: this.$guildIconHost(this.host),
          guildID: this.id,
          name: asObj.guildName,
          picture: asObj.guildPicture,
        })
      } catch (e) {
        console.log(e)
        this.$showDialog(DialogType.Error, e.statusMessage || e)
      }
    }
  },
  methods: {
    onGuildIconClick() {
      this.$updateRoute({
        guildid: this.id,
        channelid:
          this.$accessor.app.data[this.host]?.guilds[this.id]?.channels?.[0] ||
          null,
        host: this.$guildIconHost(this.host),
      })
    },
    onContextMenu(e: MouseEvent) {
      e.preventDefault()
      this.$accessor.guildContextMenu.openDialog({
        guildID: this.id,
        host: this.host,
        x: e.clientX,
        y: e.clientY,
      })
    },
  },
})
</script>
