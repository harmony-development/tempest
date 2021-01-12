<template>
  <div class="fill-height d-flex flex-column">
    <v-toolbar dense style="flex: 0">
      <v-toolbar-title> Roles and Permissions </v-toolbar-title>
      <v-spacer />
      <new-role-button />
    </v-toolbar>
    <v-sheet color="harmony lighten-1" class="d-flex fill-height">
      <v-list dense nav color="transparent" width="200px">
        <v-list-item-group mandatory>
          <v-list-item
            v-for="r in mappedRoles || []"
            :key="r.id"
            @click="selectedRole = r.id"
          >
            <v-list-item-icon>
              <div
                class="role-color"
                :style="{ backgroundColor: getColor(r.color) }"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ r.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider vertical />
      <div class="permission-list">
        <v-list
          v-if="selectedRoleData"
          color="harmony"
          two-line
          class="permission-list-inner"
        >
          <v-subheader
            >{{ selectedRoleData.name }}<v-spacer />
            <v-btn outlined color="red" @click="deleteSelectedRole"
              >Delete Role</v-btn
            >
          </v-subheader>
          <v-list-item
            v-for="(node, key) in withModified"
            :key="key"
            link
            :ripple="false"
          >
            <v-list-item-content>
              <v-list-item-title>{{ `perms.${key}` }}</v-list-item-title>
              <v-list-item-subtitle>{{
                `perms.${key}.description`
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn-toggle :value="node">
                <v-btn small :value="0" @click="setDeny(key)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn small :value="-1" @click="unset(key)">
                  <v-icon>mdi-triangle-outline</v-icon>
                </v-btn>
                <v-btn small :value="1" @click="setAllow(key)">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </v-sheet>
    <v-snackbar :value="changed" :timeout="-1">
      You have unsaved changes
      <template>
        <v-btn text class="ml-2 mr-2" @click="resetAll"> Cancel </v-btn>
        <v-btn color="green" @click="saveChanges"> Save Changes </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.list-root {
  background-color: var(--v-harmony-base);
  height: 100%;
}
.role-color {
  border-radius: 100%;
  width: 100%;
  height: 100%;
}

.container.fill-height {
  flex-direction: column;
  align-items: initial;
}

.container.fill-height > .row {
  flex: 1 1 auto;
}

.permission-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.permission-list-inner {
  flex: 1 0 0;
  overflow-y: auto;
}
</style>

<script lang="ts">
import {
  Permission,
  PermissionList,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/chat/v1/permissions_pb'
import Vue from 'vue'
import NewRoleButton from './NewRoleButton.vue'
import { IRoleData, permissionsList } from '~/store/app'

interface PermissionNode {
  state: -1 | 0 | 1
}

export default Vue.extend({
  components: { NewRoleButton },
  data() {
    return {
      selectedRole: undefined as string | undefined,
      modifiedPermissions: {} as { [key: string]: number },
    }
  },
  computed: {
    mappedRoles() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.roles?.map((role) => ({
        ...this.$accessor.app.data[this.$getHost()]?.roles[role],
        id: role,
      }))
    },
    selectedRoleData(): IRoleData | undefined {
      if (!this.selectedRole) return undefined
      return this.$accessor.app.data[this.$getHost()]?.roles?.[
        this.selectedRole
      ]
    },
    appliedPermissions(): {
      [id: string]: number
    } {
      return {
        ...permissionsList,
        ...this.selectedRoleData?.permissions,
      }
    },
    withModified(): {
      [id: string]: number
    } {
      return {
        ...this.appliedPermissions,
        ...this.modifiedPermissions,
      }
    },
    changed(): boolean {
      return !Object.keys(this.modifiedPermissions).every(
        (key) => this.appliedPermissions[key] === this.modifiedPermissions[key],
      )
    },
  },
  watch: {
    selectedRole: {
      async handler() {
        if (!this.selectedRole) return
        if (!this.selectedRoleData?.permissions) {
          await this.$fetchPermissions(
            this.$getHost(),
            this.$route.params.guildid,
            this.$route.params.channelid,
            this.selectedRole,
          )
        }
      },
    },
  },
  async mounted() {
    await this.$fetchGuildRoles(this.$getHost(), this.$route.params.guildid)
  },
  methods: {
    getColor(color: number) {
      return `#${(color & 0x0ffffff).toString(16).padStart(6, '0')}${(
        color >>> 24
      )
        .toString(16)
        .padStart(2, '0')}`
    },
    setAllow(key: string) {
      Vue.set(this.modifiedPermissions, key, 1)
    },
    setDeny(key: string) {
      Vue.set(this.modifiedPermissions, key, 0)
    },
    unset(key: string) {
      Vue.set(this.modifiedPermissions, key, -1)
    },
    resetAll() {
      this.modifiedPermissions = {}
    },
    async saveChanges() {
      const permsList = new PermissionList()
      const permissions = Object.keys(this.withModified)
        .filter((p) => this.withModified[p] === 0 || this.withModified[p] === 1)
        .map((p) => {
          const perm = new Permission()
          perm.setMatches(p)
          perm.setMode(this.withModified[p] as 0 | 1)
          return perm
        })
      permsList.setPermissionsList(permissions)
      await this.$setRolePermissions(
        this.$getHost(),
        this.$route.params.guildid,
        this.$route.params.channelid,
        this.selectedRole!,
        permsList,
      )
    },
    async deleteSelectedRole() {
      await this.$deleteRole(
        this.$getHost(),
        this.$route.params.guildid,
        this.selectedRole!,
      )
      this.selectedRole = undefined
    },
  },
})
</script>
