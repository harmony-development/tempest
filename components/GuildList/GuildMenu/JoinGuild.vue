<template>
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
      <div class="mt-3">
        <v-btn color="primary">Join Guild</v-btn>
        <v-btn text>Cancel</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
