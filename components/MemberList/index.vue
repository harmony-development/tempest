<template>
  <v-list color="transparent" class="list-body">
    <member-list-item
      v-for="member in memberList || []"
      :id="member"
      :key="member"
    />

    <v-menu v-if="ownProfile" top offset-y :close-on-content-click="false">
      <template v-if="ownProfile" #activator="{ on, attrs }">
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
        <v-list-item
          v-for="s in statuses"
          :key="s.name"
          :class="{ 'profile-item': true, active: s.status === status }"
          @click="setStatus(s.status)"
        >
          <v-list-item-action>
            <v-badge offset-x="3" offset-y="10" :color="s.color"></v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> {{ s.name }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link @click="openProfileSettings">
          <v-list-item-icon>
            <v-icon> mdi-account-cog </v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="logout">
          <v-list-item-icon>
            <v-icon> mdi-logout-variant </v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
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
  background-color: var(--v-harmony-base);
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

.avatar {
  background-color: grey;
  width: 36px;
  height: 36px;
  border-radius: 48px;
}

.active::before {
  opacity: 0.24 !important;
}

.profile-item:hover::before {
  opacity: 0.1;
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
import { DialogType } from '~/store/dialog'
export default Vue.extend({
  components: { MemberListItem },
  data() {
    return {
      statuses: [
        {
          status: UserStatus.USER_STATUS_ONLINE_UNSPECIFIED,
          name: 'Online',
          color: 'green',
        },
        {
          status: UserStatus.USER_STATUS_DO_NOT_DISTURB,
          name: 'Do Not Disturb',
          color: 'red',
        },
        {
          status: UserStatus.USER_STATUS_IDLE,
          name: 'Idle',
          color: 'yellow',
        },
        {
          status: UserStatus.USER_STATUS_OFFLINE,
          name: 'Offline',
          color: 'grey',
        },
      ] as {
        status: UserStatusMap[keyof UserStatusMap]
        name: string
        color: string
      }[],
    }
  },
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
      return a
        ? `${this.$accessor.app.host}/_harmony/media/download/${a}`
        : undefined
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
    logout() {
      this.$accessor.app.setSession() // todo: make sure localstorage is cleared correctly
      Object.values(this.$accessor.app.connections).forEach((conn) =>
        conn.client?.close(),
      )
      this.$router.push('/')
      this.$showDialog(DialogType.Info, 'Successfully logged out')
    },
    openProfileSettings() {
      this.$accessor.ui.setProfileSettingsOpen(true)
    },
    async setStatus(newStatus: UserStatusMap[keyof UserStatusMap]) {
      await this.$updateProfile(this.$getHost(), {
        newStatus,
      })
    },
  },
})
</script>
