import colors from 'vuetify/lib/util/colors'

export default {
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - staccato-vue',
    title: 'Staccato',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/static/fix.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/fragments.js', mode: 'client' },
    { src: '~/plugins/infiniteScroll.ts', mode: 'client' },
    { src: '~/plugins/virtualScroll.ts', mode: 'client' },
    { src: '~/plugins/routing.ts', mode: 'client' },
    { src: '~/plugins/harmonyURIParser.ts', mode: 'client' },
    { src: '~/plugins/harmonyAPI.ts', mode: 'client' },
    { src: '~/plugins/eventHandling.ts', mode: 'client' },
    { src: '~/plugins/dialogs.ts', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.lighten2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
      options: {
        customProperties: true,
      },
    },
    treeShake: true,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: false,
    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    },
  },
  vue: {
    config: {
      productionTip: true,
      devtools: true,
    },
  },
  router: {
    extendRoutes(routes) {
      routes.push({
        path: '/app/:guildid?/:channelid?/:messageid?',
        component: '~/pages/_app',
        name: 'app',
      })
    },
  },
}
