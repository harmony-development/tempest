<template>
  <v-dialog v-model="dialog" max-width="290">
    <template v-slot:activator="{ on: dialogOn, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon>
            <v-icon
              size="24px"
              v-bind="attrs"
              v-on="{ ...tooltip, ...dialogOn }"
              >mdi-plus</v-icon
            >
          </v-btn>
        </template>
        Add Channel
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="headline"> Create Channel </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name"
          outlined
          hide-details="auto"
        ></v-text-field>
        <v-list v-model="channelType" dense>
          <v-subheader>CHANNEL TYPE</v-subheader>
          <v-list-item-group v-model="channelType" color="primary" mandatory>
            <v-list-item value="text">
              <v-list-item-icon>
                <v-icon>mdi-pound</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Text Channel</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item value="category">
              <v-list-item-icon>
                <v-icon>mdi-file-tree</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Category</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Cancel </v-btn>
        <v-btn color="primary " text :disabled="!name" @click="dialog = false">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      dialog: false,
      channelType: 'text',
      name: '',
    }
  },
})
</script>
