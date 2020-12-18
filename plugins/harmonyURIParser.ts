import Vue from 'vue'

export interface IParseResult {
  host: string
  code: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $parseHarmonyURI(uri: string): IParseResult
  }
}

Vue.prototype.$parseHarmonyURI = (uri: string) => {
  if (!uri.startsWith('harmony://')) throw new Error('invalid protocol')
  // browsers are hardcoded to parse HTTP urls 🗿
  const parsed = new URL(uri.replace('harmony://', 'http://'))
  return {
    host: `http://${parsed.host}:${parsed.port || 2289}`,
    code: parsed.pathname.substr(1),
  }
}
