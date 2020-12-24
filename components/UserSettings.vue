<template>
  <v-dialog
    max-width="600"
    :value="open"
    :fullscreen="breakpoint"
    @input="closeDialog"
  >
    <v-card>
      <v-card-title class="headline"> Profile Settings </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col sm="3" cols="12">
              <v-row justify="center">
                <v-btn
                  icon
                  width="auto"
                  height="auto"
                  class="mb-4"
                  @click="avatarClicked"
                >
                  <s-image width="100px" height="100px" :src="displayAvatar" />
                  <input
                    ref="fileUpload"
                    type="file"
                    hidden
                    multiple
                    @change="avatarSelected"
                  />
                </v-btn>
              </v-row>
            </v-col>
            <v-col sm="9" cols="12">
              <v-row align="center" style="height: 100%">
                <v-text-field
                  label="Username"
                  outlined
                  hide-details="auto"
                  :value="displayUsername"
                  @input="newUsername = $event"
                ></v-text-field>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn color="primary darken-1" text @click="saveChanges">
          Save Chances
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { IUserData } from '~/store/app'
export default Vue.extend({
  data() {
    return {
      newUsername: '' as string,
      newAvatarPreview: undefined as string | undefined,
      newAvatarFile: undefined as File | undefined,
    }
  },
  computed: {
    open() {
      return this.$accessor.app.profileSettingsOpen
    },
    data(): IUserData | undefined {
      const host = this.$accessor.app.host
      const userID = this.$accessor.app.userID
      return this.$accessor.app.data[host!]?.users[userID!]
    },
    breakpoint(): any {
      return (this as any).$vuetify.breakpoint.xs
    },
    displayUsername(): string {
      return this.newUsername || this.data?.username || ''
    },
    displayAvatar(): string | undefined {
      if (this.newAvatarPreview) {
        return this.newAvatarPreview
      } else if (this.data?.avatar) {
        return this.data?.avatar
          ? `${this.$getHost()}/_harmony/media/download/${this.data?.avatar}`
          : undefined
      }
      return undefined
    },
  },
  methods: {
    closeDialog() {
      this.$accessor.app.setProfileSettingsOpen(false)
    },
    async saveChanges() {
      const host = this.$accessor.app.host!
      let newAvatar: string | undefined
      if (this.newAvatarFile) {
        newAvatar = await this.$uploadFile(host, this.newAvatarFile)
      }

      await this.$updateProfile(host, {
        newUsername: this.newUsername || undefined,
        newAvatar,
      })
      this.closeDialog()
    },
    avatarClicked() {
      ;(this.$refs.fileUpload as HTMLInputElement).click()
    },
    avatarSelected(e: Event) {
      const input = e.target as HTMLInputElement
      const f = input.files?.[0]
      if (f && f.type.startsWith('image/')) {
        this.newAvatarFile = f
        this.newAvatarPreview = URL.createObjectURL(f)
      }
    },
  },
})
</script>
