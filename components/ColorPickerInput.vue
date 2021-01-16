<template>
  <v-text-field v-model="color" outlined label="Color" hide-details="auto">
    <template v-slot:append>
      <v-menu
        v-model="menu"
        top
        nudge-bottom="105"
        nudge-left="16"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-icon :color="color" v-on="on"> mdi-eyedropper </v-icon>
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-color-picker v-model="color" flat />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '#ffffff',
    },
  },
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    color: {
      get(): string {
        return this.value
      },
      set(val: string): void {
        this.$emit('input', val)
      },
    },
  },
})
</script>
