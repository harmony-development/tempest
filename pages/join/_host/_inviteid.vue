<template></template>

<script lang="ts">
import Vue from 'vue'
import { Connection } from '@harmony-dev/harmony-web-sdk'

export default Vue.extend({
  async mounted() {
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
