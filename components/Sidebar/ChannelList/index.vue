<template>
  <v-list v-if="channelList" dense color="#00000000" shaped>
    <channel-list-item
      v-for="channel in channelList"
      :id="channel"
      :key="channel"
    />
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import ChannelListItem from './ChannelListItem.vue'
import { DialogType } from '~/store/dialog'
export default Vue.extend({
  components: {
    ChannelListItem,
  },
  computed: {
    guildName(): string | undefined {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.name
    },
    selectedGuildID() {
      return this.$route.params.guildid
    },
    channelList() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.channels
    },
  },
  watch: {
    '$route.params.guildid': {
      handler() {
        this.fetchData()
      },
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (this.$route.params.guildid && !this.channelList) {
        try {
          await this.$fetchChannelList(
            this.$getHost(),
            this.$route.params.guildid,
          )
        } catch (e) {
          console.log(e)
          this.$showDialog(DialogType.Error, e.statusMessage || e)
        }
      }
    },
  },
})
</script>
