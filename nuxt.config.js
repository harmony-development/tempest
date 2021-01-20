export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  analyze: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'tempest',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/fragment.js' },
    { src: '~/plugins/routing.ts' },
    { src: '~/plugins/icons.ts' },
    { src: '~/plugins/eventHandling.ts' },
    { src: '~/plugins/harmonyAPI.ts' },
    { src: '~/plugins/harmonyURIParser.ts' },
    { src: '~/plugins/getters.ts' },
    { src: '~/plugins/clickaway.ts', mode: 'client' },
    { src: '~/plugins/persistedState.client.ts', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api',
    '@nuxtjs/color-mode',
    'nuxt-typed-vuex',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'v-wave/nuxt',
    'nuxt-i18n',
  ],

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/app/:guildid?/:channelid?/:messageid?',
        component: resolve(__dirname, 'pages/_app'),
        name: 'mainapp',
      })
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  telemetry: false,
  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },
  i18n: {
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        file: 'en-US.js',
        name: 'English',
      },
    ],
  },
}
