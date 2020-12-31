import Vue from 'vue'

interface UpdateRouteArgs {
  host?: string
  guildid?: string
  channelid?: string
  messageid?: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $updateRoute(args: UpdateRouteArgs): string
  }
}

Vue.prototype.$updateRoute = function (this: Vue, args: UpdateRouteArgs) {
  const result: {
    [key: string]: string
  } = {}
  if (args.guildid !== undefined) result.guildid = args.guildid
  if (args.channelid !== undefined) result.channelid = args.channelid
  if (args.messageid !== undefined) result.messageid = args.messageid
  this.$router.push({
    params: result,
    hash: `#${encodeURIComponent(args.host ?? this.$getHost())}`,
  })
}
