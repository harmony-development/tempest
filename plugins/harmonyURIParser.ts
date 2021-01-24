import Vue from 'vue'
import { appState } from '~/store/app'

export interface IParseResult {
  host: string
  code: string
}

export interface IMediaResult {
  host: string
  id: string
  download: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $parseHarmonyURI(uri: string): IParseResult
    $parseMediaURI(host: string, uri: string): string
    $toReqHost(host: string): string
    $toMediaURI(host: string, attachmentID: string): string
    $guildIconHost(host: string): string
  }
}

Vue.prototype.$parseHarmonyURI = (uri: string) => {
  if (!uri.startsWith('harmony://')) throw new Error('invalid protocol')
  // browsers are hardcoded to parse HTTP urls 🗿
  const parsed = new URL(uri.replace('harmony://', 'https://'))
  return {
    host: `${parsed.host}:${parsed.port || 2289}`,
    code: parsed.pathname.substr(1),
  }
}

Vue.prototype.$parseMediaURI = function (this: Vue, host: string, uri: string) {
  if (!uri.startsWith('hmc://')) {
    return this.$toMediaURI(host, uri)
  }
  // browsers are hardcoded to parse HTTP urls 🗿
  const parsed = new URL(uri.replace('hmc://', 'https://'))
  const attachmentID = parsed.pathname.substr(1)
  return `https://${parsed.host}/_harmony/media/download/${attachmentID}`
}

Vue.prototype.$toReqHost = (host: string) => {
  if (host.startsWith('https://')) return host
  else return `https://${host}`
}

Vue.prototype.$toMediaURI = (host: string, attachmentID: string) => {
  return `${
    host.startsWith('https://') ? '' : 'https://'
  }${host}/_harmony/media/download/${attachmentID}`
}

Vue.prototype.$guildIconHost = function (this: Vue, host: string) {
  return host ? this.$toReqHost(host) : appState.state.host
}
