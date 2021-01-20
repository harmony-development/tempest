<template>
  <list class="overflow-auto flex-1 min-h-auto">
    <channel-list-item
      v-for="c in channelsList || []"
      :id="c"
      :key="c"
      :selected="selectedChannel === c"
      :class="{
        selected: selectedChannel === c,
        channelItem: true,
      }"
    />
  </list>
</template>

<style lang="postcss" scoped>
.selected {
  @apply border-primary-400 border-l-4;
}

.channelItem {
  @apply transition-all ease-in-out duration-150;
}
</style>

<script lang="ts">
import Vue from 'vue'
import ChannelListItem from './ChannelListItem.vue'
import { IGuildData } from '~/store/app'
export default Vue.extend({
  components: { ChannelListItem },
  computed: {
    guildData(): IGuildData | undefined {
      return this.$guildData()
    },
    channelsList(): string[] | undefined {
      return this.guildData?.channels
    },
    selectedChannel(): string | undefined {
      return this.$route.params.channelid
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
      if (this.$route.params.guildid && !this.channelsList) {
        try {
          await this.$fetchChannelList(
            this.$getHost(),
            this.$route.params.guildid
          )
        } catch (e) {
          console.log(e)
        }
      }
    },
  },
})
</script>
