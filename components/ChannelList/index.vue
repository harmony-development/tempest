<template>
  <div class="channel-list">
    <v-list dense>
      <channel-list-item
        v-for="channel in channelList"
        :id="channel"
        :key="channel"
      />
    </v-list>
  </div>
</template>

<style scoped>
.channel-list {
  width: 400px;
  overflow-y: auto;
  text-overflow: ellipsis;
  background-color: var(--harmony-dark-700);
}
</style>

<script lang="ts">
import Vue from 'vue'
import ChannelListItem from './ChannelListItem.vue'
import { IChannelData } from '~/store/app'
import { DialogType } from '~/store/dialog'
export default Vue.extend({
  components: {
    ChannelListItem,
  },
  computed: {
    selectedGuildID() {
      return this.$route.params.guildid
    },
    channelList() {
      return this.$accessor.app.data[window.location.host.substr(1)]?.guilds[
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
  methods: {
    async fetchData() {
      if (this.$route.params.guildid) {
        try {
          const conn = await this.$getOrFederate(this.$accessor.app.host!)
          const resp = await conn.getGuildChannels(this.$route.params.guildid)
          const asObj = resp.message?.toObject()

          const mapped = asObj!.channelsList.reduce<{
            [channelID: string]: IChannelData
          }>((prev, val) => {
            Vue.set(prev, val.channelId, {
              channelName: val.channelName,
              isCategory: val.isCategory,
              isVoice: val.isVoice,
            })
            return prev
          }, {})

          this.$accessor.app.setGuildChannels({
            host: window.location.hash.substr(1),
            guildID: this.$route.params.guildid,
            channels: asObj!.channelsList.map((c) => c.channelId),
          })
          this.$accessor.app.setChannelsData({
            host: window.location.hash.substr(1),
            data: mapped,
          })
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage || e)
        }
      }
    },
  },
})
</script>
