<template>
  <div>
    <div class="loading-root">
      <circular-progress v-if="loading" />
    </div>
    <div v-if="stepType === 'choice'" class="choice-root">
      <h3 class="text-xl">{{ $i18n.t(`auth.${choiceTitle}`) }}</h3>
      <list class="mt-2" color="var(--harmony-dark-500)">
        <list-item
          v-for="c in choices"
          :key="c"
          link
          class="choice-item mr-2 ml-2"
          @click.native="selectChoice(c)"
          >{{ $i18n.t(`auth.${c}`) }}
        </list-item>
      </list>
      <div class="flex justify-end mt-2">
        <h-btn
          color="primary"
          text
          :disabled="!canGoBack"
          @click.native="stepBack"
          >{{ $i18n.t('back') }}</h-btn
        >
      </div>
    </div>
    <div v-if="stepType === 'form'" class="formRoot">
      <h3 class="text-xl">{{ $i18n.t(`auth.${formTitle}`) }}</h3>
      <form @submit.prevent="formSubmitted">
        <div v-for="(f, idx) in formFields || []" :key="f.name">
          <new-password
            v-if="f.type === 'new-password'"
            v-model="(formFieldValues || [])[idx]"
          />
          <h-text-field
            v-else
            v-model="(formFieldValues || [])[idx]"
            :type="f.type"
            :autocomplete="f.type"
            :placeholder="$i18n.t(`auth.${f.name}`)"
            class="mt-2 w-full"
          />
        </div>
        <div class="flex justify-end mt-2">
          <h-btn
            class="mr-2"
            text
            :disabled="!canGoBack"
            type="button"
            @click.native="stepBack"
            >{{ $i18n.t('back') }}
          </h-btn>
          <h-btn type="submit" filled :disabled="!allFieldsFilled">{{
            $i18n.t('done')
          }}</h-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.loading-root {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}

.choice-root {
  width: 100%;
}

.choice-item {
  border-radius: 4px;
}
</style>

<script lang="ts">
import { Connection } from '@harmony-dev/harmony-web-sdk'
import {
  AuthStep,
  NextStepRequest,
} from '@harmony-dev/harmony-web-sdk/dist/protocol/auth/v1/auth_pb'
import Vue from 'vue'
import NewPassword from '@/components/NewPassword.vue'
import CircularProgress from '~/components/CircularProgress.vue'
import List from '~/components/List.vue'
import ListItem from '~/components/ListItem.vue'
import HBtn from '~/components/HBtn.vue'

export default Vue.extend({
  components: {
    NewPassword,
    CircularProgress,
    List,
    ListItem,
    HBtn,
  },
  data() {
    return {
      loading: true,
      canGoBack: false,
      conn: undefined as Connection | undefined,
      authID: undefined as string | undefined,
      stepType: undefined as string | undefined,
      choiceTitle: undefined as string | undefined,
      choices: [] as string[],
      formTitle: undefined as string | undefined,
      formFields: undefined as AuthStep.Form.FormField.AsObject[] | undefined,
      formFieldValues: undefined as (string | number)[] | undefined,
    }
  },
  computed: {
    allFieldsFilled(): boolean {
      return this.formFieldValues!.every((v) => !!v)
    },
  },
  async mounted() {
    this.conn = new Connection(this.$getHost())
    this.conn.events.addListener('auth-event', this.onAuthStep, {})
    this.conn.events.addListener('auth-disconnect', this.onAuthDisconnect, {})
    const resp = await this.conn.beginAuth()
    this.authID = resp.message!.getAuthId()
    await this.conn.streamSteps(this.authID)
    const step = await this.conn.nextAuthStep(this.authID)

    this.loading = false

    this.onAuthStep(this.conn.host, step.message!.toObject())
  },
  methods: {
    onAuthStep(_: string, ev: AuthStep.AsObject) {
      this.loading = true
      this.canGoBack = ev.canGoBack
      if (ev.choice) {
        this.stepType = 'choice'
        this.choiceTitle = ev.choice.title
        this.choices = ev.choice.optionsList
      } else if (ev.form) {
        this.stepType = 'form'
        this.formTitle = ev.form.title
        this.formFields = ev.form.fieldsList
        this.formFieldValues = this.formFields.map((f) =>
          f.type === 'number' ? 0 : ''
        )
      } else if (ev.session) {
        this.$accessor.app.setUserID(ev.session.userId)
        this.$accessor.app.setSession(ev.session.sessionToken)
        this.$accessor.app.setHost(this.$getHost())
        if (this.$accessor.entry.pendingInvite !== undefined) {
          const inv = this.$accessor.entry.pendingInvite
          this.$accessor.entry.setPendingInvite(undefined)
          this.$router.push({ path: `/join/${inv.host}/${inv.id}` })
        } else {
          this.$router.push({ path: '/app' })
        }
      }
      this.loading = false
    },
    onAuthDisconnect(_status: number, _message: string, _headers: any) {
      console.log('disconnected')
    },
    async selectChoice(c: string) {
      if (!this.conn || !this.authID) return

      const req = new NextStepRequest.Choice()

      req.setChoice(c)

      await this.conn.nextAuthStep(this.authID, {
        choice: req,
      })
    },
    async formSubmitted() {
      if (!this.conn || !this.authID || !this.formFieldValues) return

      const req = new NextStepRequest.Form()

      req.setFieldsList(
        this.formFieldValues.map((f, i) => {
          const field = new NextStepRequest.FormFields()
          if (this.formFields?.[i].type === 'number')
            field.setNumber(f as number)
          else if (
            this.formFields?.[i].type === 'password' ||
            this.formFields?.[i].type === 'new-password'
          )
            field.setBytes(btoa(f as string))
          else field.setString(f as string)
          return field
        })
      )

      await this.conn.nextAuthStep(this.authID, {
        form: req,
      })
    },
    async stepBack() {
      if (!this.conn || !this.authID) return

      await this.conn.stepBack(this.authID)
    },
  },
})
</script>
