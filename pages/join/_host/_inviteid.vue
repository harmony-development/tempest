<template></template>

<script lang="ts">
import Vue from 'vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'

export default Vue.extend({
  async mounted() {
    if (!this.$accessor.app.host || !this.$accessor.app.session) {
      let host = this.$route.params.host
      if (host.includes('://'))
        host = `https${host.substr(host.indexOf('://'))}`
      else host = `https://${host}`
      const parsed = new URL(host)

      const joinConn = new Connection(
        `https://${parsed.hostname}:${parsed.port || '2289'}`,
      )

      const data = await joinConn.previewInvite(this.$route.params.inviteid)

      this.$accessor.entry.setPendingInvite({
        host: this.$route.params.host,
        id: this.$route.params.inviteid,
        guildName: data.message?.getName() ?? 'Unknown Guild',
      })

      this.$router.push('/entry/serverselect')
      return
    }

    const conn = new Connection(this.$accessor.app.host)
    conn.session = this.$accessor.app.session
    this.$accessor.app.setConnection({
      host: this.$accessor.app.host,
      connection: conn,
    })

    let host = this.$route.params.host
    if (host.includes('://')) host = `https${host.substr(host.indexOf('://'))}`
    else host = `https://${host}`
    const parsed = new URL(host)

    const joinConn = await this.$getOrFederate(
      `https://${parsed.hostname}:${parsed.port || '2289'}`,
    )
    const resp = await joinConn.joinGuild(this.$route.params.inviteid)
    await conn.addGuildToGuildList(
      resp.message!.getGuildId(),
      joinConn.host === conn.host ? '' : joinConn.host,
    )
    this.$router.push({
      name: 'mainapp',
    })
  },
})
</script>
