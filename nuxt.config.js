module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Олсиор смотрит аниме',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'cache-control', content: 'max-age=31536000' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'yandex-verification', content: '9ef2af352f0e448e' },
      { hid: 'description', name: 'description', content: 'Сайт с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата, режим театра, мобильный интерфейс.' },
      { property: 'og:description', hid: 'og:description', name: 'og:description', content: 'Сайт с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата, режим театра, мобильный интерфейс.' },
      { property: 'og:title', hid: 'og:title', name: 'og:title', content: 'Олсиор смотрит аниме' },
      { property: 'og:url', hid: 'og:url', name: 'og:url', content: 'https://olsior.herokuapp.com' },
      { property: 'og:image', hid: 'og:image', name: 'og:image', content: 'https://olsior.herokuapp.com/site.jpg' },
      { hid: 'Keywords', name: 'Keywords', content: 'Olsior, olsior, олсиор, Олсиор, смотрит, Смотрит, аниме, Аниме, Olsior смотрит аниме, Olsior записи аниме стримов, олсиор аниме записи, Anime, anime, наруто, блич, Naruto, bleach, Bleach, врата штейна, смотрит, аниме, записи стримов, стримы, Стримы олсиора, Записи олсиора, Olsior twitch' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  loading: '~/components/loadingBar.vue',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/css/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    'nuxt-windicss',
    '@nuxtjs/fontawesome',
    '@nuxtjs/pwa',
  ],

  pwa: {
    manifest: {
      name: '',
      lang: 'ru',
      useWebmanifestExtension: false,
      short_name: 'Когда наруто?',
      start_url: '/',
      background_color: "#1b1b1b",
      description: "Приложение с записями стримов просмотра аниме Olsior\'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата, режим театра, мобильный интерфейс."
    }
  },

  fontawesome: {
    icons: {
      solid: ['faChevronRight', 'faCommentAlt', 'faDownload', 'faStar', 'faCommentSlash', 'faComment', 'faExpand', 'faCompress', 'faPhoneVolume'],
      regular: [],
      light: [],
      duotone: [],
      brands: []
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    [
      '@rkaliev/nuxtjs-yandex-metrika',
      {
        id: '84051220',
        webvisor: true,
        clickmap: true,
        debug: false,
        noJS: false,
        disabled: false,
      },
    ]
    // https://go.nuxtjs.dev/pwa  ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  serverMiddleware: {
    '/api': '~/api'
  },

  server: {
    port: 8080 // default: localhost
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
