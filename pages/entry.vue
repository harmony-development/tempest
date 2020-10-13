<template>
  <div class="root">
    <v-sheet class="body pa-6" rounded>
      <v-stepper v-model="step" alt-labels>
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">
            Server Select
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="step > 2" step="2">
            Login/Register
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <server-select v-model="step" />
          </v-stepper-content>
          <v-stepper-content step="2">
            <auth />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-sheet>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body {
  width: 60%;
}
</style>

<script lang="ts">
import Vue from 'vue'
import ServerSelect from './serverselect.vue'
import Auth from './auth.vue'

export default Vue.extend({
  components: {
    ServerSelect,
    Auth,
  },
  data() {
    return {
      step: 1,
    }
  },
})
</script>
