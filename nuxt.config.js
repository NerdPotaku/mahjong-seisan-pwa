const webpack = require('webpack')

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '麻雀精算表Webアプリ',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'mahjong-seisan'
      },
    ],
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/earlyaccess/nicomoji.css'
    }, {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/earlyaccess/notosansjp.css'
    }, {
      rel: 'icon',
      href: 'favicon.ico'
    }]
  },
  mode: 'spa',
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },
  plugins: ['./plugins/buefy', './plugins/vueTouch', './plugins/firebaseInit', "./plugins/localStorage.js"],
  css: [
    'shitajicss/docs/css/shitaji.min.css'
  ],
  modules: ['@nuxtjs/pwa'],
  manifest: {
    name: '麻雀精算表',
    lang: 'ja',
    short_name: '麻雀精算表',
    start_url: '/',
    display: 'standalone',
    orientation: 'landscape',
    background_color: 'black'
  },
  workbox: {
    dev: true, //開発環境でもPWAできるように
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** postcss-custom-propertiesのwarning非表示
     */
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {
      isDev,
      isClient
    }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(
        new webpack.EnvironmentPlugin(['APIKEY', 'AUTHDOMAIN', 'DATABASEURL', 'PROJECTID', 'STORAGEBUCKET', 'MESSAGINGSENDERID'])
      )
    }
  }
}
