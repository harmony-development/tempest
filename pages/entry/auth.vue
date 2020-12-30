<template>
  <div>
    <div class="loading-root">
      <v-progress-circular v-if="loading" indeterminate />
    </div>
    <div v-if="stepType === 'choice'" class="choice-root">
      <h3>{{ choiceTitle }}</h3>
      <v-list class="mt-2" color="var(--harmony-dark-500)">
        <v-list-item
          v-for="c in choices"
          :key="c"
          link
          class="choice-item mr-2 ml-2"
          @click="selectChoice(c)"
          >{{ c }}</v-list-item
        >
      </v-list>
      <div class="d-flex justify-end">
        <v-btn
          class="mt-2"
          color="primary"
          text
          :disabled="!canGoBack"
          @click="stepBack"
          >Back</v-btn
        >
      </div>
    </div>
    <div v-if="stepType === 'form'" class="formRoot">
      <h3>{{ formTitle }}</h3>
      <form @submit.prevent="formSubmitted">
        <v-text-field
          v-for="(f, idx) in formFields || []"
          :key="f.name"
          v-model="(formFieldValues || [])[idx]"
          :label="f.name"
          :type="f.type"
          outlined
          hide-details="auto"
          class="mt-2"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn
            class="mt-2 mr-2"
            color="primary"
            text
            :disabled="!canGoBack"
            @click="stepBack"
            >Back</v-btn
          >
          <v-btn class="mt-2" type="submit" color="primary">Done</v-btn>
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

export default Vue.extend({
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
          f.type === 'number' ? 0 : '',
        )
      } else if (ev.session) {
        this.$accessor.app.setUserID(ev.session.userId)
        this.$accessor.app.setSession(ev.session.sessionToken)
        this.$accessor.app.setHost(this.$getHost())
        this.$router.push({ path: '/app' })
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
          if (this.formFields?.[i].type === 'password')
            field.setBytes(btoa(f as string))
          else field.setString(f as string)
          return field
        }),
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
