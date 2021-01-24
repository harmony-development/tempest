import Vue, { VueConstructor } from 'vue'
import { Converter } from 'showdown'

declare module 'vue/types/vue' {
  interface Vue {
    $markdownRenderer: Converter
  }
}

const markdownClasses: {
  [key: string]: string
} = {
  p: 'msg-p',
  pre: 'codeblock',
}

export default {
  install(v: VueConstructor<Vue>, inst: Vue) {
    v.prototype.$markdownRenderer = new Converter({
      simplifiedAutoLink: true,
      openLinksInNewWindow: true,
      ghCodeBlocks: true,
      extensions: [
        ...Object.keys(markdownClasses).map((key) => ({
          type: 'output',
          regex: new RegExp(`<${key}>`, 'g'),
          replace: `<${key} class="${markdownClasses[key]}" $1>`,
        })),
        {
          type: 'lang',
          filter: (text, _converter, _options) => {
            return text.replaceAll(/<:.+?:>/g, (m) => {
              return `<img class="${
                m.length === text.replace(/\s/g, '').length
                  ? 'big-emoji'
                  : 'emoji'
              }" src="${inst.$toMediaURI(inst.$getHost(), m.slice(2, -2))}" />`
            })
          },
        },
      ],
    })
  },
}
