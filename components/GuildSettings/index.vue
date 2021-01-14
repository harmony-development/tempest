<template>
  <v-dialog
    :value="open"
    persistent
    max-width="1000px"
    transition="scroll-y-reverse-transition"
    @input="dialogChange"
  >
    <v-card>
      <v-app-bar>
        <v-app-bar-title>{{ displayName || 'Unknown Name' }}</v-app-bar-title>
        <v-spacer />
        <v-btn icon min-width="0px" @click="dialogChange">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-app-bar>
      <v-container fluid class="fill-height" style="height: 600px">
        <v-row class="fill-height flex-nowrap">
          <v-col cols="5" sm="4" md="3" class="fill-height">
            <div class="sidebar fill-height">
              <v-list dense nav>
                <v-list-item
                  :class="{ 'sidebar-item': true, active: page === 'overview' }"
                  @click="page = 'overview'"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-layers-search</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Overview</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  :class="{ 'sidebar-item': true, active: page === 'roles' }"
                  @click="page = 'roles'"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-account-details</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Roles and Permissions</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <delete-guild-button />
              </v-list>
            </div>
          </v-col>
          <v-col>
            <keep-alive>
              <overview v-if="page === 'overview'" />
              <roles v-if="page === 'roles'" />
            </keep-alive>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.active {
  background-color: var(--v-accent-base);
  border-left: 4px solid var(--v-primary-base);
}

.sidebar-item {
  transition: 0.1s ease-in;
}

.sidebar {
  border-right: 1px solid var(--v-accent-base);
}

.dangerous {
  background-color: var(--v-error-base);
}
</style>

<script lang="ts">
import Vue from 'vue'
import Overview from '@/components/GuildSettings/Overview.vue'
import DeleteGuildButton from './DeleteGuildButton.vue'
import Roles from './Roles.vue'

export default Vue.extend({
  components: {
    Overview,
    DeleteGuildButton,
    Roles,
  },
  data() {
    return {
      page: 'overview' as 'overview' | 'roles',
    }
  },
  computed: {
    open() {
      return this.$accessor.ui.guildSettingsOpen
    },
    displayName() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.name
    },
  },
  methods: {
    dialogChange() {
      this.$accessor.ui.setGuildSettingsOpen(false)
    },
  },
})
</script>
