export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Олсиор смотрит аниме',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Сайт с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата, режим театра, мобильный интерфейс.' },
      { property: 'og:description', hid: 'og:description', name: 'og:description', content: 'Сайт с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата, режим театра, мобильный интерфейс.' },
      { property: 'og:title', hid: 'og:title', name: 'og:title', content: 'Олсиор смотрит аниме' },
      { property: 'og:url', hid: 'og:url', name: 'og:url', content: 'https://olsior.herokuapp.com' },
      { property: 'og:image', hid: 'og:image', name: 'og:image', content: 'https://olsior.herokuapp.com/site.jpg' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.10.1/css/all.css',
      }
    ],
  },

  loading: '~/components/loadingBar.vue',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~assets/css/global.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa  ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  serverMiddleware: {
    '/api': '~/api'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    }
  }
}
