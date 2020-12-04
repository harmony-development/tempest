<template>
  <v-dialog
    :value="open"
    persistent
    fullscreen
    transition="scroll-y-reverse-transition"
    @input="dialogChange"
  >
    <v-card class="fill-height">
      <v-container fluid class="fill-height">
        <v-row class="fill-height">
          <v-col cols="4" sm="4" md="3" lg="2" class="fill-height">
            <div class="sidebar fill-height">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    {{ displayName || 'Unknown Name' }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

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
          <v-col md="1" cols="2">
            <v-btn icon large min-width="0px" @click="dialogChange">
              <v-icon> mdi-close </v-icon>
            </v-btn>
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
      return this.$accessor.app.guildSettingsOpen
    },
    displayName() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.name
    },
  },
  methods: {
    dialogChange() {
      this.$accessor.app.setGuildSettingsOpen(false)
    },
  },
})
</script>
