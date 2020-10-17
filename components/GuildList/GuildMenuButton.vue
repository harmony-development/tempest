<template>
  <v-dialog v-model="dialogOpen" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab text large color="primary" dark v-bind="attrs" v-on="on">
        <v-icon dark size="24"> mdi-account-multiple-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-tabs fixed-tabs>
        <v-tab>Join Guild</v-tab>
        <v-tab>Create Guild</v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-text-field outlined label="Invite Link" hide-details="auto">
                <template v-slot:append>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
                    </template>
                    Invites look like this: <br />
                    asdf72 <br />
                    harmony://[domain]/[invite] <br />
                    epic-discord
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn text>Cancel</v-btn>
              <v-spacer />
              <v-btn color="primary">Join Guild</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat> </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      dialogOpen: false,
    }
  },
})
</script>
