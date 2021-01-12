<template>
  <div class="fill-height">
    <v-row class="mb-3">
      <v-col cols="12" md="3">
        <v-row justify="center" class="mb-4">
          <v-btn icon width="auto" height="auto" @click="pictureClicked">
            <s-image width="100px" height="100px" :src="displayPicture" />
          </v-btn>
        </v-row>
        <v-row justify="center">
          <v-btn outlined color="primary" @click="pictureClicked"
            >Change Picture</v-btn
          >
          <input
            ref="fileUpload"
            type="file"
            hidden
            multiple
            @change="pictureSelected"
          />
        </v-row>
      </v-col>
      <v-col>
        <v-text-field
          outlined
          label="Guild Name"
          :value="displayName"
          @input="guildNameChange"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider />
    <v-toolbar dense>
      <v-toolbar-title>Invites</v-toolbar-title>
      <v-spacer />
      <v-dialog v-model="inviteDialog" max-width="320">
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined color="primary" v-bind="attrs" v-on="on"
            >New Invite</v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline"> Create Invite </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="inviteName"
              hide-details="auto"
              outlined
              label="Invite Name"
            />
            <v-checkbox
              label="Infinite Uses"
              :value="maxUses < 0"
              @change="maxUses = $event ? -1 : 1"
            />
            <v-text-field
              v-model.number="maxUses"
              outlined
              label="Maximum Uses"
              type="number"
              hide-details="auto"
              :rules="[(value) => value > 0]"
              :disabled="maxUses < 0"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="secondary" @click="inviteDialog = false"
              >Cancel</v-btn
            >
            <v-btn
              text
              color="primary"
              :disabled="maxUses === 0 || !inviteName"
              @click="createInvite"
              >Create Invite</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-sheet color="harmony lighten-1 pa-3">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Invite Name</th>
              <th class="text-left">Uses</th>
              <th class="text-left">Possible Uses</th>
              <th class="text-left" style="width: 90px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invites || []" :key="inv.inviteId">
              <td>{{ inv.inviteId }}</td>
              <td>{{ inv.useCount }}</td>
              <td>{{ inv.possibleUses === -1 ? '∞' : inv.possibleUses }}</td>
              <td class="d-flex align-center">
                <v-btn icon @click="copyInvite(inv.inviteId)">
                  <v-icon size="18"> mdi-content-copy </v-icon>
                </v-btn>
                <v-btn icon @click="deleteInvite(inv.inviteId)">
                  <v-icon size="18"> mdi-delete </v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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

<script lang="ts">
import Vue from 'vue'
import SImage from '../SImage.vue'
import { IGuildData } from '~/store/app'
export default Vue.extend({
  components: { SImage },
  data() {
    return {
      guildName: undefined as string | undefined,
      newPicturePreview: undefined as string | undefined,
      newPictureFile: undefined as File | undefined,
      inviteName: '',
      maxUses: 1,
      inviteDialog: false,
    }
  },
  computed: {
    guildData(): IGuildData | undefined {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]
    },
    displayName(): string | undefined {
      if (this.guildName !== undefined) {
        return this.guildName
      } else {
        return this.guildData?.name
      }
    },
    displayPicture(): string | undefined {
      if (this.newPicturePreview) {
        return this.newPicturePreview
      } else if (this.guildData?.picture) {
        return this.$parseMediaURI(this.$getHost(), this.guildData.picture)
      }
      return undefined
    },
    guildNameChanged(): boolean {
      return (
        this.guildName !== undefined &&
        this.guildName !==
          this.$accessor.app.data[this.$getHost()]?.guilds[
            this.$route.params.guildid
          ]?.name
      )
    },
    changed(): boolean {
      return this.guildNameChanged || !!this.newPictureFile
    },
    invites() {
      return this.$accessor.app.data[this.$getHost()]?.guilds[
        this.$route.params.guildid
      ]?.invites
    },
  },
  async mounted() {
    await this.$fetchInvites(this.$getHost(), this.$route.params.guildid)
  },
  methods: {
    guildNameChange(value: string) {
      this.guildName = value
    },
    resetAll() {
      Object.assign(this.$data, (this.$options as any).data())
    },
    async deleteInvite(inviteId: string) {
      await this.$deleteInvite(
        this.$getHost(),
        this.$route.params.guildid,
        inviteId,
      )
      this.$accessor.app.deleteInvite({
        host: this.$getHost(),
        guildID: this.$route.params.guildid,
        inviteID: inviteId,
      })
    },
    async createInvite() {
      await this.$createInvite(
        this.$getHost(),
        this.$route.params.guildid,
        this.inviteName,
        this.maxUses,
      )
      this.$accessor.app.createInvite({
        host: this.$getHost(),
        guildID: this.$route.params.guildid,
        inviteID: this.inviteName,
        maxUses: this.maxUses,
      })
      this.inviteDialog = false
    },
    copyInvite(inviteID: string) {
      navigator.clipboard.writeText(`https://chat.harmonyapp.io/${inviteID}`)
    },
    pictureClicked() {
      ;(this.$refs.fileUpload as HTMLInputElement).click()
    },
    pictureSelected(e: Event) {
      const input = e.target as HTMLInputElement
      const f = input.files?.[0]
      if (f && f.type.startsWith('image/')) {
        this.newPictureFile = f
        this.newPicturePreview = URL.createObjectURL(f)
      }
    },
    async saveChanges() {
      let newPicture: string | undefined
      const host = this.$accessor.app.host!
      if (this.newPictureFile) {
        newPicture = await this.$uploadFile(host, this.newPictureFile)
      }
      await this.$updateGuildInfo(
        this.$getHost(),
        this.$route.params.guildid,
        this.guildName,
        newPicture,
      )
      if (this.newPictureFile) {
        URL.revokeObjectURL(this.newPicturePreview!)
        this.newPicturePreview = undefined
        this.newPictureFile = undefined
      }
    },
  },
})
</script>
