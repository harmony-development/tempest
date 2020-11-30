<template>
  <v-menu
    :value="value"
    :close-on-content-click="false"
    left
    offset-x
    :nudge-left="10"
    v-bind="$attrs"
    @input="update"
    v-on="$listeners"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"
      ><slot :name="slot" v-bind="scope"
    /></template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ username || id }}</v-list-item-title>
            <v-list-item-subtitle>Offline</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    activatorSlot() {
      return this.$scopedSlots.activator
    },
    username() {
      return this.$accessor.app.data[this.$getHost()]?.users[this.id]?.username
    },
  },
  methods: {
    update(newVal: boolean) {
      this.$emit('input', newVal)
    },
  },
})
</script>
