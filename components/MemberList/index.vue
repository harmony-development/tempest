<template>
  <v-list color="#00000000" class="list-body">
    <member-list-item
      v-for="member in memberList || []"
      :id="member"
      :key="member"
    />
  </v-list>
</template>

<style scoped lang="scss">
.member-list {
  display: flex;
  flex: 0 0 250px;
  min-height: auto;
  min-width: 0;
  flex-direction: column;
  height: 100%;
  background-color: var(--harmony-dark-700);
}

.list-body {
  &::-webkit-scrollbar {
    width: 6px;
    visibility: hidden;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 32px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
}

.list-body:hover {
  &::-webkit-scrollbar-thumb {
    background: var(--v-accent-darken1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--v-accent-lighten1);
  }
}

.list-body {
  height: 100%;
  flex: 1 0 0;
  overflow-y: auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
import MemberListItem from './MemberListItem.vue'
export default Vue.extend({
  components: { MemberListItem },
  computed: {
    memberList() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.memberList
    },
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      if (this.$route.params.guildid && !this.memberList) {
        await this.$fetchMemberList(this.$getHost(), this.$route.params.guildid)
      }
    },
  },
})
</script>
