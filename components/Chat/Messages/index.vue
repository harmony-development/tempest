<template>
  <div class="chat">
    <v-list color="#00000000">
      <message />
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Message from './Message.vue'
import { DialogType } from '~/store/dialog'

export default Vue.extend({
  components: {
    Message,
  },
  computed: {
    selectedGuildID() {
      return this.$route.params.guildid
    },
    messagesList() {
      return this.$accessor.app.data[this.$getHost()]?.channels[
        this.$route.params.channelid
      ]?.messages
    },
  },
  watch: {
    '$route.params.channelid': {
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
      if (
        this.$route.params.guildid &&
        this.$route.params.channelid &&
        !this.messagesList
      ) {
        try {
          await this.$fetchMessageList(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
          )
        } catch (e) {
          this.$showDialog(DialogType.Error, e.statusMessage || e)
        }
      }
    },
  },
})
</script>
