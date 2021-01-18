<template>
  <fragment>
    <app-bar absolute>
      <h1 class="text-2xl">Tempest</h1>
      <spacer />
      <dropdown>
        <template slot="activator" slot-scope="{ toggle }">
          <h-btn icon text @click.native="toggle()">
            <fa-icon icon="globe" size="1x" />
          </h-btn>
        </template>
        <list>
          <list-item
            v-for="(lang, idx) in $i18n.locales || []"
            :key="idx"
            @click="$i18n.setLocale(lang.code)"
          >
            {{ lang.name }}
          </list-item>
        </list>
      </dropdown>
    </app-bar>
    <div class="h-full w-full flex items-center background">
      <div class="bg-harmonydark-800 w-1/4 ml-12 p-6 rounded">
        <nuxt-child />
      </div>
    </div>
  </fragment>
</template>

<style lang="postcss" scoped>
.background {
  background: url('~@/static/wiggle.svg');
  background-repeat: repeat;
  stroke: black;
}
</style>

<script lang="ts">
import Vue from 'vue'
import AppBar from '~/components/AppBar.vue'
import Dropdown from '~/components/Dropdown.vue'
import List from '~/components/List.vue'
import ListItem from '~/components/ListItem.vue'
import Spacer from '~/components/Spacer.vue'

export default Vue.extend({
  components: { AppBar, Spacer, Dropdown, List, ListItem },
  methods: {
    toggleTheme() {
      this.$colorMode.preference =
        this.$colorMode.preference === 'light' ? 'dark' : 'light'
    },
  },
})
</script>
