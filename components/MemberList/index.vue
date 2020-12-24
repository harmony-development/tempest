<template>
  <v-list color="#00000000" class="list-body">
    <member-list-item
      v-for="member in memberList || []"
      :id="member"
      :key="member"
    />

    <v-menu v-if="ownProfile" top offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-ripple
          class="member-item pa-1 my-profile"
          v-bind="attrs"
          v-on="on"
        >
          <user-status-indicator :id="$accessor.app.userID">
            <v-img class="avatar mr-2" :src="avatar"></v-img>
          </user-status-indicator>
          <v-list-item-title>{{ ownProfile.username }}</v-list-item-title>
          <v-list-item-action>
            <v-icon> mdi-chevron-up </v-icon>
          </v-list-item-action>
        </div>
      </template>
      <v-list subheader>
        <div class="status-root">
          <v-sheet
            v-ripple
            color="grey"
            height="60px"
            class="status-option"
            @click="setStatus(userStatusMap.USER_STATUS_OFFLINE)"
          >
            <v-icon
              v-if="status === userStatusMap.USER_STATUS_OFFLINE"
              color="black"
            >
              mdi-check
            </v-icon>
          </v-sheet>
          <v-sheet
            v-ripple
            color="yellow"
            class="status-option"
            @click="setStatus(userStatusMap.USER_STATUS_IDLE)"
          >
            <v-icon
              v-if="status === userStatusMap.USER_STATUS_IDLE"
              color="black"
            >
              mdi-check
            </v-icon>
          </v-sheet>
          <v-sheet
            v-ripple
            color="red"
            class="status-option"
            @click="setStatus(userStatusMap.USER_STATUS_DO_NOT_DISTURB)"
          >
            <v-icon
              v-if="status === userStatusMap.USER_STATUS_DO_NOT_DISTURB"
              color="black"
            >
              mdi-check
            </v-icon>
          </v-sheet>
          <v-sheet
            v-ripple
            :dark="false"
            color="green"
            class="status-option"
            @click="setStatus(userStatusMap.USER_STATUS_ONLINE_UNSPECIFIED)"
          >
            <v-icon
              v-if="status === userStatusMap.USER_STATUS_ONLINE_UNSPECIFIED"
              color="black"
            >
              mdi-check
            </v-icon>
          </v-sheet>
        </div>
        <v-list-item link @click="openProfileSettings">
          <v-list-item-icon>
            <v-icon> mdi-account-cog </v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
  position: relative;

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

.member-item {
  transition: 0.1s ease-in;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  user-select: none;
}

.my-profile {
  position: absolute;
  width: 100%;
  bottom: 10px;
}

.member-item:hover {
  background-color: var(--v-accent-base);
}

.avatar {
  background-color: grey;
  width: 36px;
  height: 36px;
  border-radius: 48px;
}

.status-root {
  display: flex;
  height: 100%;
  width: 100%;
}

.status-option {
  width: 100%;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import Vue from 'vue'
import {
  UserStatus,
  UserStatusMap,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/harmonytypes/v1/types_pb'
import MemberListItem from './MemberListItem.vue'
import { IUserData } from '~/store/app'
export default Vue.extend({
  components: { MemberListItem },
  computed: {
    memberList() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.memberList
    },
    ownProfile(): IUserData | undefined {
      return this.$accessor.app.data[this.$accessor.app.host!]?.users[
        this.$accessor.app.userID!
      ]
    },
    avatar(): string | undefined {
      if (!this.ownProfile) return undefined
      const a = this.ownProfile?.avatar
      return a ? `${this.$getHost()}/_harmony/media/download/${a}` : undefined
    },
    status(): UserStatusMap[keyof UserStatusMap] {
      return this.ownProfile?.status ?? UserStatus.USER_STATUS_OFFLINE
    },
    userStatusMap(): UserStatusMap {
      return UserStatus
    },
  },
  watch: {
    '$route.params.guildid': {
      handler() {
        this.fetchData()
      },
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
    openProfileSettings() {
      this.$accessor.app.setProfileSettingsOpen(true)
    },
    async setStatus(newStatus: UserStatusMap[keyof UserStatusMap]) {
      await this.$updateProfile(this.$getHost(), {
        newStatus,
      })
    },
  },
})
</script>
