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
          <v-row no-gutters>
            <v-col>
              <v-checkbox
                v-model="displayIsBot"
                label="Bot Account"
                @change="newIsBot = $event"
              ></v-checkbox>
            </v-col>
          </v-row>
          <br />
          <v-row align="center">
            <h3 class="subtitle-1 mr-3">{{ $t('app.personas.title') }}</h3>
            <v-btn color="primary darken-1" icon small @click="newPersona">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-row>
          <h4
            v-if="this.$accessor.app.personas.length === 0"
            class="subtitle text-center mt-3 mb-3 subtitle-2"
          >
            No Subaccounts Added
          </h4>
          <v-list v-else>
            <v-list-item
              v-for="(item, i) in this.$accessor.app.personas"
              :key="i"
            >
              <v-list-item-avatar>
                <s-image :src="item.avatar"></s-image>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"> </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="deletePersona(i)">
                  <v-icon color="grey lighten-1">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-row>
            <h3 class="subtitle-1">Theme</h3>
          </v-row>
          <v-row>
            <v-col>
              <v-row>
                <v-col>
                  <v-switch
                    label="Dark Theme"
                    :value="oldDark"
                    @change="darkThemeChanged"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <h3 class="subtitle-1">Primary</h3>
                  <v-color-picker
                    hide-canvas
                    hide-inputs
                    hide-mode-switch
                    hide-sliders
                    show-swatches
                    :value="oldPrimary"
                    @input="primaryColorChanged"
                  />
                </v-col>
                <v-col>
                  <h3 class="subtitle-1">Secondary</h3>
                  <v-color-picker
                    hide-canvas
                    hide-inputs
                    hide-mode-switch
                    hide-sliders
                    show-swatches
                    :value="oldSecondary"
                    @input="secondaryColorChanged"
                  />
                </v-col>
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
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog :value="subIsOpen" max-width="300" :fullscreen="breakpoint">
      <v-card>
        <v-card-title class="headline"> Create Subaccount </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="subaccountName"
              outlined
              label="Subaccount Name"
            >
            </v-text-field>
            <v-select
              v-model="subaccountKind"
              :items="subaccountItems"
              outlined
              label="Subaccount Kind"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="subIsOpen = false">
            Cancel
          </v-btn>
          <v-btn color="primary darken-1" text @click="createPersona">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { IUserData, PersonaKind } from '~/store/app'

export default Vue.extend({
  data() {
    return {
      newUsername: '' as string,
      newAvatarPreview: undefined as string | undefined,
      newAvatarFile: undefined as File | undefined,
      newIsBot: undefined as boolean | undefined,
      subIsOpen: false,
      subaccountName: '',
      subaccountKind: PersonaKind.Plurality,
      oldDark: this.$vuetify.theme.dark,
      oldPrimary: this.$vuetify.theme.currentTheme.primary?.toString(),
      oldSecondary: this.$vuetify.theme.currentTheme.secondary?.toString(),
    }
  },
  computed: {
    subaccountItems() {
      return [{ text: 'System Member', value: PersonaKind.Plurality }]
    },
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
    displayIsBot: {
      get(): boolean {
        return this.newIsBot ?? this.data?.bot ?? false
      },
      set(b): void {
        this.newIsBot = b as any
      },
    },
  },
  methods: {
    newPersona() {
      this.subIsOpen = true
    },
    createPersona() {
      this.$accessor.app.setPersonas(
        this.$accessor.app.personas.concat([
          {
            kind: this.subaccountKind,
            name: this.subaccountName,
            avatar: null,
          },
        ]),
      )
      this.subIsOpen = false
    },
    deletePersona(idx: number) {
      this.$accessor.app.setPersonas(
        this.$accessor.app.personas.filter((_, index) => index !== idx),
      )
    },
    closeDialog() {
      this.$accessor.app.setProfileSettingsOpen(false)
    },
    async saveChanges() {
      this.$accessor.theming.applyTheme({
        dark: this.$vuetify.theme.dark,
        primary:
          this.$vuetify.theme.currentTheme.primary?.toString() || '#000000',
        secondary:
          this.$vuetify.theme.currentTheme.secondary?.toString() || '#000000',
      })
      const host = this.$accessor.app.host!
      let newAvatar: string | undefined
      if (this.newAvatarFile) {
        newAvatar = await this.$uploadFile(host, this.newAvatarFile)
      }
      await this.$updateProfile(host, {
        newUsername: this.newUsername || undefined,
        newAvatar,
        newIsBot: this.newIsBot,
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
    darkThemeChanged(dark: boolean) {
      this.$vuetify.theme.dark = dark
    },
    primaryColorChanged(event: string) {
      console.log(event)
      this.$vuetify.theme.currentTheme.primary = event
    },
    secondaryColorChanged(event: string) {
      console.log(event)
      this.$vuetify.theme.currentTheme.secondary = event
    },
  },
})
</script>
