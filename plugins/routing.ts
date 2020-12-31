import Vue from 'vue'

interface UpdateRouteArgs {
  host?: string
  guildid?: string | null
  channelid?: string | null
  messageid?: string | null
}

declare module 'vue/types/vue' {
  interface Vue {
    $updateRoute(args: UpdateRouteArgs): string
    $clearRoute(): void
  }
}

Vue.prototype.$updateRoute = function (this: Vue, args: UpdateRouteArgs) {
  let newPath = '/app'
  const endHash = `#${encodeURIComponent(args.host ?? this.$getHost())}`
  const newGuildID = args.guildid || this.$route.params.guildid
  const newChannelID = args.channelid || this.$route.params.channelid
  const newMessageID = args.messageid || this.$route.params.messageid

  if (args.guildid === null) {
    this.$router.push(`${newPath}${endHash}`)
    return
  }
  if (newGuildID) newPath += `/${newGuildID}`
  if (args.channelid === null) {
    this.$router.push(`${newPath}${endHash}`)
    return
  }
  if (newChannelID) newPath += `/${newChannelID}`
  if (args.messageid === null) {
    this.$router.push(`${newPath}${endHash}`)
    return
  }
  if (newMessageID) newPath += `/${newMessageID}`
  this.$router.push(`${newPath}${endHash}`)
}

Vue.prototype.$clearRoute = function (this: Vue) {
  this.$router.push({
    path: '/app',
  })
}
