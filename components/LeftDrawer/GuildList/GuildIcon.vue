<template>
  <button
    v-wave
    :class="{ 'guild-icon': true, selected, 'hint--right': true }"
    :aria-label="name || id"
    @click.prevent.stop="onGuildIconClick"
    @mousedown.prevent=""
  >
    <img
      :src="picture"
      class="w-14 h-14 object-cover outline-none rounded-full inline"
      draggable="false"
    />
  </button>
</template>

<style lang="postcss" scoped>
.guild-icon {
  @apply outline-none rounded-full border-2 border-transparent block mb-1 transform duration-100;

  &:hover {
    transform: translateY(-3px);
    @apply shadow-sm;
  }
}

.selected {
  @apply border-primary-400;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { IGuildData } from '~/store/app'
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
  data() {
    return {
      error: undefined as Error | undefined,
    }
  },
  computed: {
    selected(): boolean {
      return this.id === this.$route.params.guildid
    },
    guildData(): IGuildData | undefined {
      return this.$guildData(this.host, this.id)
    },
    name(): string {
      return this.guildData?.name || this.id
    },
    picture(): string | undefined {
      const pic = this.guildData?.picture
      if (!pic) return undefined
      const parsed = this.$parseMediaURI(this.host, pic)
      return parsed
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
        this.error = e
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
  },
})
</script>
